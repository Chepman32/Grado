import React from 'react';
import {
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
  style?: StyleProp<ViewStyle>;
  onLoad?: (event: NativeSyntheticEvent<GradoFilteredVideoLoadEvent>) => void;
  onProgress?: (event: NativeSyntheticEvent<GradoFilteredVideoProgressEvent>) => void;
  onEnd?: () => void;
}

const NativeGradoFilteredVideoView =
  requireNativeComponent<GradoFilteredVideoViewProps>('GradoFilteredVideoView');

export default function GradoFilteredVideoView(
  props: GradoFilteredVideoViewProps,
): React.JSX.Element {
  return <NativeGradoFilteredVideoView {...props} />;
}
