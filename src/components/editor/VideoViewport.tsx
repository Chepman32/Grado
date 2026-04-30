import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  ChevronsLeftRight,
  Columns2,
  Volume2,
  VolumeX,
} from 'lucide-react-native';

import { useEditorStore } from '../../store/useEditorStore';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import { getFilterById, IDENTITY_MATRIX } from '../../filters';
import { useAppTheme, useThemedStyles, type AppTheme } from '../../theme';
import GradoFilteredVideoView from './GradoFilteredVideoView';
import AnimatedPressable from '../shared/AnimatedPressable';

interface VideoViewportProps {
  height: number;
}

const COMPARE_HANDLE_SIZE = 44;
const COMPARE_TOUCH_WIDTH = 72;
const COMPARE_LINE_WIDTH = 2;
const INITIAL_COMPARE_POSITION = 0.5;
const COMPARE_ACCESSIBILITY_STEP = 0.1;
const COMPARE_SETTLE_DURATION_MS = 180;

function clampComparisonPosition(position: number): number {
  return Math.min(Math.max(position, 0), 1);
}

/**
 * Video viewport.
 *
 * iOS uses a native AVFoundation + Core Image pipeline for real-time filtered
 * preview frames. Android keeps the temporary overlay fallback until a
 * matching native pipeline is added there too.
 *
 * Long press: temporarily hides overlay to preview original.
 * Tap: play/pause toggle.
 */
export default function VideoViewport({
  height,
}: VideoViewportProps): React.JSX.Element {
  const theme = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const colors = theme.colors;
  const currentVideoUri = useEditorStore(s => s.currentVideoUri);
  const activeFilterId = useEditorStore(s => s.activeFilterId);
  const filterIntensity = useEditorStore(s => s.filterIntensity);
  const setFilterIntensity = useEditorStore(s => s.setFilterIntensity);
  const isMuted = useEditorStore(s => s.isMuted);
  const setMuted = useEditorStore(s => s.setMuted);
  const isPlaying = useEditorStore(s => s.isPlaying);
  const requestedSeekTime = useEditorStore(s => s.requestedSeekTime);
  const seekRequestId = useEditorStore(s => s.seekRequestId);

  const savedIntensity = useRef<number>(filterIntensity);
  const { videoRef, toggle, seek, onLoad, onProgress, onEnd } =
    useVideoPlayer();
  const [viewportWidth, setViewportWidth] = useState(0);
  const [accessibilityComparisonPosition, setAccessibilityComparisonPosition] =
    useState(INITIAL_COMPARE_POSITION);
  const [isComparisonEnabled, setIsComparisonEnabled] = useState(true);
  const viewportWidthValue = useSharedValue(0);
  const comparisonPosition = useSharedValue(INITIAL_COMPARE_POSITION);
  const comparisonEnabledValue = useSharedValue(1);

  const filter = getFilterById(activeFilterId);
  const dominantColor = filter?.dominantColor ?? colors.accent;
  const filterMatrix = filter?.colorMatrix ?? IDENTITY_MATRIX;
  const isOriginal = activeFilterId === 'original';
  const canCompare = Boolean(currentVideoUri) && !isOriginal;
  const showComparison = canCompare && isComparisonEnabled;
  // Overlay opacity = 0.35 * intensity for non-original filters
  const overlayOpacity = isOriginal ? 0 : 0.35 * filterIntensity;

  // Long-press gesture — show original while held
  const isLongPressing = useSharedValue(false);
  const compareDragStartPosition = useSharedValue(INITIAL_COMPARE_POSITION);
  const isDraggingComparison = useSharedValue(0);

  const handleViewportLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const width = event.nativeEvent.layout.width;
      setViewportWidth(width);
      viewportWidthValue.value = width;
    },
    [viewportWidthValue],
  );

  const restoreIntensity = useCallback(() => {
    setFilterIntensity(savedIntensity.current);
  }, [setFilterIntensity]);

  const saveAndZeroIntensity = useCallback(() => {
    savedIntensity.current = filterIntensity;
    setFilterIntensity(0);
  }, [filterIntensity, setFilterIntensity]);

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      'worklet';
      isLongPressing.value = true;
      runOnJS(saveAndZeroIntensity)();
    })
    .onFinalize(() => {
      'worklet';
      if (isLongPressing.value) {
        isLongPressing.value = false;
        runOnJS(restoreIntensity)();
      }
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    'worklet';
    runOnJS(toggle)();
  });

  const composedGesture = Gesture.Exclusive(longPressGesture, tapGesture);

  const syncComparisonPositionForAccessibility = useCallback(
    (position: number) => {
      setAccessibilityComparisonPosition(clampComparisonPosition(position));
    },
    [],
  );

  const animateComparisonPosition = useCallback(
    (position: number) => {
      const clampedPosition = clampComparisonPosition(position);
      comparisonPosition.value = withTiming(clampedPosition, {
        duration: COMPARE_SETTLE_DURATION_MS,
      });
      setAccessibilityComparisonPosition(clampedPosition);
    },
    [comparisonPosition],
  );

  const handleComparisonAccessibilityAction = useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      const direction = event.nativeEvent.actionName === 'increment' ? 1 : -1;
      animateComparisonPosition(
        accessibilityComparisonPosition +
          direction * COMPARE_ACCESSIBILITY_STEP,
      );
    },
    [accessibilityComparisonPosition, animateComparisonPosition],
  );

  const toggleComparisonEnabled = useCallback(() => {
    const nextEnabled = !isComparisonEnabled;
    comparisonEnabledValue.value = withTiming(nextEnabled ? 1 : 0, {
      duration: COMPARE_SETTLE_DURATION_MS,
    });
    setIsComparisonEnabled(nextEnabled);
  }, [comparisonEnabledValue, isComparisonEnabled]);

  const comparisonPanGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      compareDragStartPosition.value = comparisonPosition.value;
      isDraggingComparison.value = withTiming(1, { duration: 120 });
    })
    .onUpdate(({ translationX }) => {
      'worklet';
      const width = viewportWidthValue.value;
      if (width <= 0) {
        return;
      }

      comparisonPosition.value = Math.min(
        Math.max(compareDragStartPosition.value + translationX / width, 0),
        1,
      );
    })
    .onFinalize(() => {
      'worklet';
      isDraggingComparison.value = withTiming(0, { duration: 160 });
      runOnJS(syncComparisonPositionForAccessibility)(comparisonPosition.value);
    });

  const androidComparisonOverlayAnimatedStyle = useAnimatedStyle(() => ({
    left:
      viewportWidthValue.value *
      comparisonPosition.value *
      comparisonEnabledValue.value,
  }));

  const iosOriginalComparisonClipAnimatedStyle = useAnimatedStyle(() => {
    const splitX =
      viewportWidthValue.value *
      comparisonPosition.value *
      comparisonEnabledValue.value;

    return {
      transform: [{ translateX: splitX - viewportWidthValue.value }],
    };
  });

  const iosOriginalComparisonContentAnimatedStyle = useAnimatedStyle(() => {
    const splitX =
      viewportWidthValue.value *
      comparisonPosition.value *
      comparisonEnabledValue.value;

    return {
      transform: [{ translateX: viewportWidthValue.value - splitX }],
    };
  });

  const compareTouchTargetAnimatedStyle = useAnimatedStyle(() => {
    const width = viewportWidthValue.value;
    const targetWidth = Math.min(COMPARE_TOUCH_WIDTH, width);
    const lineX = width * comparisonPosition.value;
    const left =
      width > COMPARE_TOUCH_WIDTH
        ? Math.min(
            Math.max(lineX - COMPARE_TOUCH_WIDTH / 2, 0),
            width - COMPARE_TOUCH_WIDTH,
          )
        : 0;

    return {
      left,
      width: targetWidth,
    };
  });

  const compareLineAnimatedStyle = useAnimatedStyle(() => {
    const width = viewportWidthValue.value;
    const lineX = width * comparisonPosition.value;
    const targetLeft =
      width > COMPARE_TOUCH_WIDTH
        ? Math.min(
            Math.max(lineX - COMPARE_TOUCH_WIDTH / 2, 0),
            width - COMPARE_TOUCH_WIDTH,
          )
        : 0;

    return {
      left: lineX - targetLeft - COMPARE_LINE_WIDTH / 2,
    };
  });

  const compareHandleAnimatedStyle = useAnimatedStyle(() => {
    const width = viewportWidthValue.value;
    const lineX = width * comparisonPosition.value;
    const targetLeft =
      width > COMPARE_TOUCH_WIDTH
        ? Math.min(
            Math.max(lineX - COMPARE_TOUCH_WIDTH / 2, 0),
            width - COMPARE_TOUCH_WIDTH,
          )
        : 0;

    return {
      left: lineX - targetLeft - COMPARE_HANDLE_SIZE / 2,
      transform: [{ scale: 1 + isDraggingComparison.value * 0.035 }],
    };
  });

  const toggleMuted = useCallback(() => {
    setMuted(!isMuted);
  }, [isMuted, setMuted]);

  const handleAndroidLoad = useCallback(
    (duration: number) => {
      onLoad(duration);

      if (seekRequestId > 0 && requestedSeekTime > 0) {
        seek(requestedSeekTime);
      }
    },
    [onLoad, requestedSeekTime, seek, seekRequestId],
  );

  useEffect(() => {
    if (Platform.OS !== 'ios' && seekRequestId > 0) {
      seek(requestedSeekTime);
    }
  }, [requestedSeekTime, seek, seekRequestId]);

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={handleViewportLayout}
    >
      <GestureDetector gesture={composedGesture}>
        <View style={StyleSheet.absoluteFill}>
          {currentVideoUri ? (
            Platform.OS === 'ios' ? (
              <GradoFilteredVideoView
                sourceUri={currentVideoUri}
                style={StyleSheet.absoluteFill}
                paused={!isPlaying}
                muted={isMuted}
                repeatVideo
                resizeMode="contain"
                filterId={activeFilterId}
                filterMatrix={filterMatrix}
                filterMatrixPayload={filterMatrix.join(',')}
                filterIntensity={filterIntensity}
                comparisonPosition={0}
                seekToTime={requestedSeekTime}
                seekRequestId={seekRequestId}
                onLoad={event => onLoad(event.nativeEvent.duration)}
                onProgress={event => onProgress(event.nativeEvent.currentTime)}
                onEnd={onEnd}
              />
            ) : (
              <Video
                ref={videoRef}
                source={{ uri: currentVideoUri }}
                style={StyleSheet.absoluteFill}
                resizeMode="contain"
                paused={!isPlaying}
                muted={isMuted}
                repeat
                onLoad={({ duration }) => handleAndroidLoad(duration)}
                onProgress={({ currentTime }) => onProgress(currentTime)}
                onEnd={onEnd}
              />
            )
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
          )}

          {Platform.OS === 'ios' &&
            showComparison &&
            currentVideoUri &&
            viewportWidth > 0 && (
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  styles.iosOriginalComparisonClip,
                  iosOriginalComparisonClipAnimatedStyle,
                ]}
                pointerEvents="none"
              >
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    iosOriginalComparisonContentAnimatedStyle,
                  ]}
                >
                  <GradoFilteredVideoView
                    sourceUri={currentVideoUri}
                    style={StyleSheet.absoluteFill}
                    paused={!isPlaying}
                    muted
                    repeatVideo
                    resizeMode="contain"
                    filterId="original"
                    filterMatrix={IDENTITY_MATRIX}
                    filterMatrixPayload={IDENTITY_MATRIX.join(',')}
                    filterIntensity={0}
                    comparisonPosition={0}
                    seekToTime={requestedSeekTime}
                    seekRequestId={seekRequestId}
                  />
                </Animated.View>
              </Animated.View>
            )}

          {/* Temporary Android-only preview overlay */}
          {Platform.OS !== 'ios' && !isOriginal && overlayOpacity > 0 && (
            <Animated.View
              style={[
                styles.androidComparisonOverlay,
                {
                  backgroundColor: dominantColor,
                  opacity: overlayOpacity,
                },
                androidComparisonOverlayAnimatedStyle,
              ]}
              pointerEvents="none"
            />
          )}
        </View>
      </GestureDetector>

      {showComparison && viewportWidth > 0 && (
        <GestureDetector gesture={comparisonPanGesture}>
          <Animated.View
            style={[styles.compareTouchTarget, compareTouchTargetAnimatedStyle]}
            accessibilityRole="adjustable"
            accessibilityLabel="Compare original and filtered preview"
            accessibilityValue={{
              min: 0,
              max: 100,
              now: Math.round(accessibilityComparisonPosition * 100),
            }}
            accessibilityActions={[
              { name: 'decrement', label: 'Show more filtered preview' },
              { name: 'increment', label: 'Show more original preview' },
            ]}
            onAccessibilityAction={handleComparisonAccessibilityAction}
          >
            <Animated.View
              pointerEvents="none"
              style={[styles.compareLine, compareLineAnimatedStyle]}
            />
            <Animated.View
              pointerEvents="none"
              style={[styles.compareHandle, compareHandleAnimatedStyle]}
            >
              <ChevronsLeftRight size={18} color={colors.black} />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      )}

      {canCompare && (
        <AnimatedPressable
          onPress={toggleComparisonEnabled}
          style={[
            styles.compareToggleButton,
            isComparisonEnabled && styles.compareToggleButtonActive,
          ]}
          accessibilityRole="switch"
          accessibilityLabel="Comparison slider"
          accessibilityState={{ checked: isComparisonEnabled }}
        >
          <Columns2
            size={18}
            color={isComparisonEnabled ? colors.black : colors.textPrimary}
          />
        </AnimatedPressable>
      )}

      <AnimatedPressable onPress={toggleMuted} style={styles.muteButton}>
        {isMuted ? (
          <VolumeX size={18} color={colors.textPrimary} />
        ) : (
          <Volume2 size={18} color={colors.textPrimary} />
        )}
      </AnimatedPressable>
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: theme.colors.black,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  placeholder: {
    backgroundColor: theme.colors.surface,
  },
  androidComparisonOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  iosOriginalComparisonClip: {
    overflow: 'hidden',
  },
  compareTouchTarget: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 15,
  },
  compareLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: COMPARE_LINE_WIDTH,
    borderRadius: COMPARE_LINE_WIDTH / 2,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.36,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  compareHandle: {
    position: 'absolute',
    top: '50%',
    width: COMPARE_HANDLE_SIZE,
    height: COMPARE_HANDLE_SIZE,
    marginTop: -COMPARE_HANDLE_SIZE / 2,
    borderRadius: COMPARE_HANDLE_SIZE / 2,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.26,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  compareToggleButton: {
    position: 'absolute',
    top: 56,
    right: 64,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.controlOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareToggleButtonActive: {
    backgroundColor: theme.colors.white,
  },
  muteButton: {
    position: 'absolute',
    top: 56,
    right: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.controlOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
