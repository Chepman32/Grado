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
import Animated from 'react-native-reanimated';

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
  comparisonPosition?: number;
  seekToTime?: number;
  seekRequestId?: number;
  eventId?: string;
  style?: StyleProp<ViewStyle>;
  animatedProps?: Partial<
    Pick<GradoFilteredVideoViewProps, 'comparisonPosition'>
  >;
  onLoad?: (event: NativeSyntheticEvent<GradoFilteredVideoLoadEvent>) => void;
  onProgress?: (
    event: NativeSyntheticEvent<GradoFilteredVideoProgressEvent>,
  ) => void;
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

const AnimatedNativeGradoFilteredVideoView = Animated.createAnimatedComponent(
  NativeGradoFilteredVideoView,
);

export default function GradoFilteredVideoView(
  props: GradoFilteredVideoViewProps,
): React.JSX.Element {
  const eventId = useRef(`grado-video-${Math.random().toString(36).slice(2)}`);
  const onLoadRef = useRef(props.onLoad);
  const onProgressRef = useRef(props.onProgress);
  const onEndRef = useRef(props.onEnd);
  const emitter = useMemo(() => {
    const nativeModule = NativeModules.GradoFilteredVideoViewEvents;
    return nativeModule ? new NativeEventEmitter(nativeModule) : null;
  }, []);

  useEffect(() => {
    onLoadRef.current = props.onLoad;
    onProgressRef.current = props.onProgress;
    onEndRef.current = props.onEnd;
  }, [props.onEnd, props.onLoad, props.onProgress]);

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

        onLoadRef.current?.({
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

        onProgressRef.current?.({
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

        onEndRef.current?.();
      },
    );

    return () => {
      loadSubscription.remove();
      progressSubscription.remove();
      endSubscription.remove();
    };
  }, [emitter]);

  const { animatedProps, ...propsWithoutAnimatedProps } = props;
  const nativeProps = { ...propsWithoutAnimatedProps };
  delete nativeProps.onLoad;
  delete nativeProps.onProgress;
  delete nativeProps.onEnd;

  return (
    <AnimatedNativeGradoFilteredVideoView
      {...nativeProps}
      animatedProps={animatedProps}
      eventId={eventId.current}
    />
  );
}
