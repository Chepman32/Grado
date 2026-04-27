import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import HomeScreen from '../src/screens/HomeScreen';
import type { RootStackParamList } from '../src/app/navigation/types';
import { useProjectStore } from '../src/store/useProjectStore';

jest.mock('../src/i18n/useTranslation', () => ({
  interpolate: (template: string, values: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (_match: string, key: string) => values[key] ?? ''),
  useTranslation: () => ({
    t: {
      renameFolderTitle: 'Rename Folder',
      newFolderTitle: 'New Folder',
      renameFolderDesc: 'Rename folder',
      newFolderDesc: 'Create folder',
      newFolderDefault: 'New Folder',
      renameLabel: 'Rename',
      createLabel: 'Create',
      renameProjectTitle: 'Rename Project',
      renameProjectDesc: 'Rename project',
      nameRequired: 'Name Required',
      nameRequiredBody: 'Please enter a non-empty name.',
      removePermanentlyTitle: 'Remove Permanently',
      removePermanentlyBody: 'Delete {name} forever?',
      cancel: 'Cancel',
      remove: 'Remove',
      cleanTrashTitle: 'Clean Trash',
      cleanTrashBody: 'Remove every project in Trash permanently?',
      cleanTrash: 'Clean Trash',
      startFirstProject: 'Start Your First Project',
      startFirstProjectBody:
        'Tap + to create a project, or use the folder button in the header first.',
    },
  }),
}));

jest.mock('../src/components/home/ProjectDashboardList', () => {
  const ReactMock = require('react');
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) =>
      ReactMock.createElement('ProjectDashboardList', props),
  };
});

jest.mock('../src/components/home/BlurHeader', () => {
  const ReactMock = require('react');
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) =>
      ReactMock.createElement('BlurHeader', props),
  };
});

jest.mock('../src/components/home/VideoPickerModal', () => {
  const ReactMock = require('react');
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) =>
      ReactMock.createElement('VideoPickerModal', props),
  };
});

jest.mock('../src/components/home/NamePromptModal', () => {
  const ReactMock = require('react');
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) =>
      ReactMock.createElement('NamePromptModal', props),
  };
});

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

describe('HomeScreen', () => {
  beforeEach(() => {
    useProjectStore.getState().reset();
  });

  it('opens folder creation from the header and project creation from the fab', async () => {
    const navigation = {
      navigate: jest.fn(),
    } as unknown as HomeProps['navigation'];

    const route = {
      key: 'Home',
      name: 'Home',
      params: undefined,
    } as HomeProps['route'];

    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <HomeScreen route={route} navigation={navigation} />,
      );
    });

    const root = renderer!.root;

    expect(root.findByType('NamePromptModal').props.visible).toBe(false);
    expect(root.findByType('VideoPickerModal').props.visible).toBe(false);

    await ReactTestRenderer.act(async () => {
      root.findByType('BlurHeader').props.onCreateFolderPress();
    });

    expect(root.findByType('NamePromptModal').props.visible).toBe(true);
    expect(root.findByType('NamePromptModal').props.title).toBe('New Folder');

    await ReactTestRenderer.act(async () => {
      root.findByType('ProjectDashboardList').props.onCreateProject();
    });

    expect(root.findByType('VideoPickerModal').props.visible).toBe(true);
  });
});
