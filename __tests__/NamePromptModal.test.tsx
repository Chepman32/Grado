import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import NamePromptModal from '../src/components/home/NamePromptModal';

describe('NamePromptModal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('closes when the backdrop is pressed', async () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <NamePromptModal
          visible
          title="New Folder"
          description="Create a folder to organize projects."
          initialValue="New Folder"
          confirmLabel="Create"
          onCancel={onCancel}
          onConfirm={onConfirm}
        />,
      );
    });

    await ReactTestRenderer.act(async () => {
      jest.runAllTimers();
    });

    expect(renderer!.root.findByProps({ testID: 'name-prompt-card' })).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer!.root.findByProps({ testID: 'name-prompt-backdrop' }).props.onPress();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
