import React from 'react';
import { Platform, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import VideoViewport from '../src/components/editor/VideoViewport';
import { useEditorStore } from '../src/store/useEditorStore';

jest.mock('../src/components/editor/GradoFilteredVideoView', () => {
  const ReactMock = require('react');

  return {
    __esModule: true,
    default: (props: Record<string, unknown>) =>
      ReactMock.createElement('GradoFilteredVideoView', props),
  };
});

function getNativeVideos(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root.findAll(
    node => String(node.type) === 'GradoFilteredVideoView',
  ) as Array<
    ReactTestRenderer.ReactTestInstance & {
      props: {
        filterId: string;
        comparisonPosition: number;
        animatedProps?: {
          comparisonPosition?: number;
        };
      };
    }
  >;
}

function getBaseNativeVideoProps(
  renderer: ReactTestRenderer.ReactTestRenderer,
) {
  const props = getNativeVideos(renderer)[0].props as {
    comparisonPosition: number;
    animatedProps?: {
      comparisonPosition?: number;
    };
  };
  return props;
}

describe('VideoViewport', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | null = null;
  const platformDescriptor = Object.getOwnPropertyDescriptor(Platform, 'OS');

  beforeEach(async () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => 'ios',
    });

    await ReactTestRenderer.act(async () => {
      useEditorStore.getState().reset();
      useEditorStore.setState({
        currentVideoUri: 'ph://demo',
        activeFilterId: 'cinematic',
        filterIntensity: 0.7,
        isMuted: true,
        isPlaying: true,
      });
    });
  });

  afterEach(async () => {
    await ReactTestRenderer.act(async () => {
      renderer?.unmount();
      renderer = null;
      useEditorStore.getState().reset();
    });

    if (platformDescriptor) {
      Object.defineProperty(Platform, 'OS', platformDescriptor);
    }
  });

  it('passes the comparison position to the native iOS preview', async () => {
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<VideoViewport height={300} />);
    });

    expect(getNativeVideos(renderer!)).toHaveLength(1);
    expect(getBaseNativeVideoProps(renderer!).comparisonPosition).toBe(0.5);
    expect(getBaseNativeVideoProps(renderer!).animatedProps).toMatchObject({
      comparisonPosition: 0.5,
    });

    const viewport = renderer!.root
      .findAllByType(View)
      .find(node => typeof node.props.onLayout === 'function');

    await ReactTestRenderer.act(async () => {
      viewport!.props.onLayout({
        nativeEvent: { layout: { width: 320, height: 300 } },
      });
    });

    expect(getNativeVideos(renderer!)).toHaveLength(1);
    expect(getNativeVideos(renderer!)[0].props.filterId).toBe('cinematic');

    const compareControl = renderer!.root.findByProps({
      accessibilityLabel: 'Compare original and filtered preview',
    });

    await ReactTestRenderer.act(async () => {
      compareControl.props.onAccessibilityAction({
        nativeEvent: { actionName: 'increment' },
      });
    });

    expect(
      renderer!.root.findByProps({
        accessibilityLabel: 'Compare original and filtered preview',
      }).props.accessibilityValue.now,
    ).toBe(60);
  });

  it('hides the compare control for the original filter', async () => {
    await ReactTestRenderer.act(async () => {
      useEditorStore.setState({ activeFilterId: 'original' });
      renderer = ReactTestRenderer.create(<VideoViewport height={300} />);
    });

    const viewport = renderer!.root
      .findAllByType(View)
      .find(node => typeof node.props.onLayout === 'function');

    await ReactTestRenderer.act(async () => {
      viewport!.props.onLayout({
        nativeEvent: { layout: { width: 320, height: 300 } },
      });
    });

    expect(
      renderer!.root.findAllByProps({
        accessibilityLabel: 'Compare original and filtered preview',
      }),
    ).toHaveLength(0);
  });

  it('toggles the compare slider off', async () => {
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<VideoViewport height={300} />);
    });

    const viewport = renderer!.root
      .findAllByType(View)
      .find(node => typeof node.props.onLayout === 'function');

    await ReactTestRenderer.act(async () => {
      viewport!.props.onLayout({
        nativeEvent: { layout: { width: 320, height: 300 } },
      });
    });

    expect(
      renderer!.root.findAllByProps({
        accessibilityLabel: 'Compare original and filtered preview',
      }).length,
    ).toBeGreaterThan(0);

    const compareToggle = renderer!.root.findByProps({
      accessibilityLabel: 'Comparison slider',
    });

    await ReactTestRenderer.act(async () => {
      compareToggle.props.onPress();
    });

    expect(getBaseNativeVideoProps(renderer!).comparisonPosition).toBe(0);
    expect(getNativeVideos(renderer!)).toHaveLength(1);
    expect(
      renderer!.root.findAllByProps({
        accessibilityLabel: 'Compare original and filtered preview',
      }),
    ).toHaveLength(0);
  });
});
