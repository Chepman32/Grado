import React, { useEffect, useMemo, useRef } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  requireNativeComponent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

export interface GradoFilteredVideoLoadEvent {
  duration: number;
}

export interface GradoFilteredVideoProgressEvent {
  currentTime: number;
}

export interface GradoFilteredVideoViewProps extends ViewProps {
  sourceUri?: string | null;
  paused: boolean;
  muted?: boolean;
  repeatVideo?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  filterId: string;
  filterMatrix: ReadonlyArray<number>;
  filterMatrixPayload?: string;
  filterIntensity: number;
  seekToTime?: number;
  seekRequestId?: number;
  eventId?: string;
  style?: StyleProp<ViewStyle>;
  onLoad?: (event: NativeSyntheticEvent<GradoFilteredVideoLoadEvent>) => void;
  onProgress?: (event: NativeSyntheticEvent<GradoFilteredVideoProgressEvent>) => void;
  onEnd?: () => void;
}

type NativeVideoEvent = {
  eventId?: string;
  duration?: number;
  currentTime?: number;
};

const LOAD_EVENT = 'GradoFilteredVideoViewLoad';
const PROGRESS_EVENT = 'GradoFilteredVideoViewProgress';
const END_EVENT = 'GradoFilteredVideoViewEnd';

const NativeGradoFilteredVideoView =
  requireNativeComponent<GradoFilteredVideoViewProps>('GradoFilteredVideoView');

export default function GradoFilteredVideoView(
  props: GradoFilteredVideoViewProps,
): React.JSX.Element {
  const eventId = useRef(`grado-video-${Math.random().toString(36).slice(2)}`);
  const emitter = useMemo(() => {
    const nativeModule = NativeModules.GradoFilteredVideoViewEvents;
    return nativeModule ? new NativeEventEmitter(nativeModule) : null;
  }, []);

  useEffect(() => {
    if (!emitter) {
      return undefined;
    }

    const loadSubscription = emitter.addListener(
      LOAD_EVENT,
      (event: NativeVideoEvent | undefined) => {
        if (
          event?.eventId !== eventId.current ||
          typeof event.duration !== 'number'
        ) {
          return;
        }

        props.onLoad?.({
          nativeEvent: { duration: event.duration },
        } as NativeSyntheticEvent<GradoFilteredVideoLoadEvent>);
      },
    );

    const progressSubscription = emitter.addListener(
      PROGRESS_EVENT,
      (event: NativeVideoEvent | undefined) => {
        if (
          event?.eventId !== eventId.current ||
          typeof event.currentTime !== 'number'
        ) {
          return;
        }

        props.onProgress?.({
          nativeEvent: { currentTime: event.currentTime },
        } as NativeSyntheticEvent<GradoFilteredVideoProgressEvent>);
      },
    );

    const endSubscription = emitter.addListener(
      END_EVENT,
      (event: NativeVideoEvent | undefined) => {
        if (event?.eventId !== eventId.current) {
          return;
        }

        props.onEnd?.();
      },
    );

    return () => {
      loadSubscription.remove();
      progressSubscription.remove();
      endSubscription.remove();
    };
  }, [emitter, props]);

  const {
    onLoad: _onLoad,
    onProgress: _onProgress,
    onEnd: _onEnd,
    ...nativeProps
  } = props;

  return (
    <NativeGradoFilteredVideoView
      {...nativeProps}
      eventId={eventId.current}
    />
  );
}
