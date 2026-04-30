import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import EditorScreen from '../src/screens/EditorScreen';
import type { RootStackParamList } from '../src/app/navigation/types';
import { useEditorStore } from '../src/store/useEditorStore';
import { useProjectStore } from '../src/store/useProjectStore';
import { useSettingsStore } from '../src/store/useSettingsStore';

jest.mock('../src/components/editor/VideoViewport', () => 'VideoViewport');
jest.mock('../src/components/editor/GradoRibbon', () => 'GradoRibbon');
jest.mock('../src/components/editor/IntensitySlider', () => 'IntensitySlider');
jest.mock('../src/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: {
      projectUnavailable: 'Project Unavailable',
      projectUnavailableBody: 'Missing project.',
      exportButton: 'Export',
      currentFilterLabel: 'Current Filter',
      intensityLabel: 'Intensity',
      filterPresets: 'Filter Presets',
      timelineLabel: 'Timeline',
    },
  }),
}));

type EditorProps = NativeStackScreenProps<RootStackParamList, 'Editor'>;

describe('EditorScreen', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | null = null;

  beforeEach(async () => {
    jest.useFakeTimers();
    await ReactTestRenderer.act(async () => {
      useEditorStore.getState().reset();
      useProjectStore.getState().reset();
      useSettingsStore.setState({
        themeId: 'dark',
        exportFormat: 'mp4',
        previewMode: 'current-playback',
      });
    });
  });

  afterEach(async () => {
    await ReactTestRenderer.act(async () => {
      renderer?.unmount();
      renderer = null;
    });
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('hydrates editor state from projectId and refreshes previews on blur', async () => {
    const updateProjectSession = jest.fn();
    const refreshProjectPreview = jest.fn(async () => {});
    const listeners: Record<string, () => void> = {};

    useProjectStore.setState({
      projects: [
        {
          id: 'project-1',
          name: 'Demo',
          sourceVideoUri: 'ph://demo',
          duration: 42,
          folderId: null,
          previousFolderId: null,
          status: 'active',
          previewUri: 'ph://demo',
          previewTimeMs: 2500,
          sessionTimeMs: 2500,
          previewKind: 'generated',
          filterId: 'cinematic',
          filterIntensity: 0.7,
          createdAt: 1,
          updatedAt: 1,
        },
      ],
      updateProjectSession,
      refreshProjectPreview,
    });

    const navigation = {
      navigate: jest.fn(),
      addListener: jest.fn((event: string, callback: () => void) => {
        listeners[event] = callback;
        return () => {
          delete listeners[event];
        };
      }),
    } as unknown as EditorProps['navigation'];

    const route = {
      key: 'Editor-project-1',
      name: 'Editor',
      params: { projectId: 'project-1' },
    } as EditorProps['route'];

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <EditorScreen route={route} navigation={navigation} />,
      );
    });

    expect(useEditorStore.getState().currentVideoUri).toBe('ph://demo');
    expect(useEditorStore.getState().activeFilterId).toBe('cinematic');
    expect(useEditorStore.getState().filterIntensity).toBe(0.7);
    expect(useEditorStore.getState().currentTime).toBe(2.5);
    expect(useEditorStore.getState().isMuted).toBe(true);
    expect(useEditorStore.getState().isPlaying).toBe(true);

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(updateProjectSession).toHaveBeenCalledWith('project-1', {
      filterId: 'cinematic',
      filterIntensity: 0.7,
      previewTimeMs: 2500,
      sessionTimeMs: 2500,
    });

    await ReactTestRenderer.act(async () => {
      listeners.blur?.();
    });

    expect(refreshProjectPreview).toHaveBeenCalledWith('project-1', {
      timeMs: 2500,
      sourceVideoUri: 'ph://demo',
      filterId: 'cinematic',
      filterIntensity: 0.7,
    });
  });

  it('uses the first second for generated previews without changing the editor resume position', async () => {
    const updateProjectSession = jest.fn();
    const refreshProjectPreview = jest.fn(async () => {});
    const listeners: Record<string, () => void> = {};

    await ReactTestRenderer.act(async () => {
      useSettingsStore.setState({ previewMode: 'first-second' });

      useProjectStore.setState({
        projects: [
          {
            id: 'project-2',
            name: 'Demo',
            sourceVideoUri: 'ph://demo',
            duration: 42,
            folderId: null,
            previousFolderId: null,
            status: 'active',
            previewUri: 'ph://demo',
            previewTimeMs: 1000,
            sessionTimeMs: 6000,
            previewKind: 'generated',
            filterId: 'cinematic',
            filterIntensity: 0.7,
            createdAt: 1,
            updatedAt: 1,
          },
        ],
        updateProjectSession,
        refreshProjectPreview,
      });
    });

    const navigation = {
      navigate: jest.fn(),
      addListener: jest.fn((event: string, callback: () => void) => {
        listeners[event] = callback;
        return () => {
          delete listeners[event];
        };
      }),
    } as unknown as EditorProps['navigation'];

    const route = {
      key: 'Editor-project-2',
      name: 'Editor',
      params: { projectId: 'project-2' },
    } as EditorProps['route'];

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <EditorScreen route={route} navigation={navigation} />,
      );
    });

    expect(useEditorStore.getState().currentTime).toBe(6);

    await ReactTestRenderer.act(async () => {
      listeners.blur?.();
    });

    expect(refreshProjectPreview).toHaveBeenCalledWith('project-2', {
      timeMs: 1000,
      sourceVideoUri: 'ph://demo',
      filterId: 'cinematic',
      filterIntensity: 0.7,
    });
  });

  it('keeps playback paused when an autosave updates the project', async () => {
    type ProjectStoreState = ReturnType<typeof useProjectStore.getState>;
    const updateProjectSession: ProjectStoreState['updateProjectSession'] = (
      targetProjectId,
      update,
    ) => {
      useProjectStore.setState((state) => ({
        projects: state.projects.map((project) =>
          project.id === targetProjectId
            ? {
                ...project,
                filterId: update.filterId ?? project.filterId,
                filterIntensity:
                  update.filterIntensity ?? project.filterIntensity,
                previewTimeMs:
                  update.previewTimeMs ?? project.previewTimeMs,
                sessionTimeMs:
                  update.sessionTimeMs ?? project.sessionTimeMs,
                updatedAt: Date.now(),
              }
            : project,
        ),
      }));
    };

    useProjectStore.setState({
      projects: [
        {
          id: 'project-3',
          name: 'Demo',
          sourceVideoUri: 'ph://demo',
          duration: 42,
          folderId: null,
          previousFolderId: null,
          status: 'active',
          previewUri: 'ph://demo',
          previewTimeMs: 2500,
          sessionTimeMs: 2500,
          previewKind: 'generated',
          filterId: 'cinematic',
          filterIntensity: 0.7,
          createdAt: 1,
          updatedAt: 1,
        },
      ],
      updateProjectSession,
    });

    const navigation = {
      navigate: jest.fn(),
      addListener: jest.fn(() => () => {}),
    } as unknown as EditorProps['navigation'];

    const route = {
      key: 'Editor-project-3',
      name: 'Editor',
      params: { projectId: 'project-3' },
    } as EditorProps['route'];

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <EditorScreen route={route} navigation={navigation} />,
      );
    });

    expect(useEditorStore.getState().isPlaying).toBe(true);

    await ReactTestRenderer.act(async () => {
      useEditorStore.getState().setIsPlaying(false);
      jest.advanceTimersByTime(400);
    });

    expect(useEditorStore.getState().isPlaying).toBe(false);
  });
});
