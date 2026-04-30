import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
  type WithSpringConfig,
} from 'react-native-reanimated';

import { FILTERS, getFilterById } from '../../filters';
import { useEditorStore } from '../../store/useEditorStore';
import { useHaptics } from '../../hooks/useHaptics';
import {
  spacing,
  typography,
  useAppTheme,
  useThemedStyles,
  type AppTheme,
} from '../../theme';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------
const SWATCH_WIDTH = 64;
const SWATCH_HEIGHT = 48;
const SWATCH_GAP = 2;
const SWATCH_RADIUS = 14;
const SWATCH_STRIDE = SWATCH_WIDTH + SWATCH_GAP;
const INDICATOR_SIZE = 8;
const INDICATOR_GAP = 4;
const RIBBON_HEIGHT = SWATCH_HEIGHT + (INDICATOR_SIZE + INDICATOR_GAP) * 2;
const RIBBON_VIEWPORT_TOP = INDICATOR_SIZE + INDICATOR_GAP;
const TOTAL_FILTERS = FILTERS.length;
const EDGE_RESISTANCE = 0.14;
const RIBBON_SNAP_SPRING: WithSpringConfig = {
  damping: 36,
  stiffness: 320,
  mass: 1,
  overshootClamping: true,
};
// The full scrollable width of all swatches.
const CONTENT_WIDTH = TOTAL_FILTERS * SWATCH_STRIDE - SWATCH_GAP;

/**
 * Given a scroll offset (translateX), returns the index of the filter whose
 * swatch center is closest to the center of the ribbon (x = 0 in offset space).
 */
function offsetToIndex(offset: number, viewWidth: number): number {
  'worklet';
  const center = -offset + viewWidth / 2;
  const raw = center / SWATCH_STRIDE;
  return Math.min(Math.max(Math.round(raw), 0), TOTAL_FILTERS - 1);
}

/**
 * Returns the translateX that centers the swatch at `index` in the ribbon.
 */
function indexToOffset(index: number, viewWidth: number): number {
  'worklet';
  const swatchCenter = index * SWATCH_STRIDE + SWATCH_WIDTH / 2;
  return viewWidth / 2 - swatchCenter;
}

/**
 * Converts a tapped x-coordinate in the ribbon viewport to the nearest filter
 * index in the translated swatch row.
 */
function positionToIndex(x: number, offset: number): number {
  'worklet';
  const contentX = x - offset;
  const raw = (contentX - SWATCH_WIDTH / 2) / SWATCH_STRIDE;
  return Math.min(Math.max(Math.round(raw), 0), TOTAL_FILTERS - 1);
}

function withAlpha(hexColor: string, alpha: number): string {
  const normalized = hexColor.replace('#', '');
  if (normalized.length !== 6) {
    return `rgba(255,255,255,${alpha})`;
  }

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}

interface GradoRibbonProps {
  /** Measured width of the container so we can center the playhead. */
  containerWidth: number;
}

/**
 * Horizontal ribbon of filter color swatches drawn in Skia.
 *
 * Interaction:
 * - Drag horizontally to scroll through filters.
 * - On release, springs to snap the nearest filter to the center playhead.
 * - Triggers a light haptic when the playhead crosses a filter boundary.
 * - Updates the store's activeFilterId on snap.
 */
export default function GradoRibbon({ containerWidth }: GradoRibbonProps): React.JSX.Element {
  const theme = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const colors = theme.colors;
  const setActiveFilter = useEditorStore((s) => s.setActiveFilter);
  const activeFilterId = useEditorStore((s) => s.activeFilterId);
  const haptics = useHaptics();

  const activeIndex = FILTERS.findIndex((f) => f.id === activeFilterId);
  const resolvedActiveIndex = activeIndex < 0 ? 0 : activeIndex;
  const initialOffset = containerWidth > 0 ? indexToOffset(resolvedActiveIndex, containerWidth) : 0;
  const [displayedIndex, setDisplayedIndex] = useState(resolvedActiveIndex);

  // Current scroll offset (translateX applied to the swatch row).
  const translateX = useSharedValue(initialOffset);
  // The last filter index the playhead was over — used for haptic ticks.
  const lastIndex = useSharedValue(activeIndex < 0 ? 0 : activeIndex);
  // Starting offset at the moment a drag begins.
  const dragStartOffset = useSharedValue(0);

  // ---- Sync the ribbon position when the store's activeFilterId changes
  // externally (e.g. from FilterWipeTransition).
  useEffect(() => {
    if (containerWidth === 0) return;
    const idx = FILTERS.findIndex((f) => f.id === activeFilterId);
    if (idx >= 0) {
      setDisplayedIndex(idx);
      lastIndex.value = idx;
      translateX.value = withSpring(
        indexToOffset(idx, containerWidth),
        RIBBON_SNAP_SPRING,
      );
    }
  }, [activeFilterId, containerWidth, lastIndex, translateX]);

  const commitFilter = useCallback(
    (index: number) => {
      const filter = FILTERS[index];
      if (filter) {
        setActiveFilter(filter.id);
      }
    },
    [setActiveFilter],
  );

  const triggerHaptic = useCallback(() => {
    haptics.light();
  }, [haptics]);

  const updateDisplayedFilter = useCallback((index: number) => {
    setDisplayedIndex(Math.min(Math.max(index, 0), TOTAL_FILTERS - 1));
  }, []);

  const snapToIndex = useCallback(
    (index: number) => {
      if (containerWidth === 0) return;

      const clampedIndex = Math.min(Math.max(index, 0), TOTAL_FILTERS - 1);
      setDisplayedIndex(clampedIndex);
      lastIndex.value = clampedIndex;
      translateX.value = withSpring(
        indexToOffset(clampedIndex, containerWidth),
        RIBBON_SNAP_SPRING,
      );
      commitFilter(clampedIndex);
    },
    [commitFilter, containerWidth, lastIndex, translateX],
  );

  // ---- Min / max allowed scroll offsets so we can't drag past ends
  const minOffset = containerWidth > 0 ? indexToOffset(TOTAL_FILTERS - 1, containerWidth) : 0;
  const maxOffset = containerWidth > 0 ? indexToOffset(0, containerWidth) : 0;

  const panGesture = Gesture.Pan()
    .minDistance(6)
    .onBegin(() => {
      'worklet';
      dragStartOffset.value = translateX.value;
    })
    .onUpdate(({ translationX }) => {
      'worklet';
      const raw = dragStartOffset.value + translationX;

      // Rubber-band resistance beyond bounds.
      let next: number;
      if (raw < minOffset) {
        next = minOffset + (raw - minOffset) * EDGE_RESISTANCE;
      } else if (raw > maxOffset) {
        next = maxOffset + (raw - maxOffset) * EDGE_RESISTANCE;
      } else {
        next = raw;
      }
      translateX.value = next;

      // Haptic tick when crossing a filter boundary.
      if (containerWidth > 0) {
        const currentIdx = offsetToIndex(next, containerWidth);
        if (currentIdx !== lastIndex.value) {
          lastIndex.value = currentIdx;
          runOnJS(updateDisplayedFilter)(currentIdx);
          runOnJS(triggerHaptic)();
        }
      }
    })
    .onEnd(() => {
      'worklet';
      if (containerWidth === 0) return;
      const snappedIndex = offsetToIndex(translateX.value, containerWidth);
      const clampedIndex = Math.min(Math.max(snappedIndex, 0), TOTAL_FILTERS - 1);
      translateX.value = withSpring(
        indexToOffset(clampedIndex, containerWidth),
        RIBBON_SNAP_SPRING,
      );
      runOnJS(updateDisplayedFilter)(clampedIndex);
      runOnJS(commitFilter)(clampedIndex);
    });

  const tapGesture = Gesture.Tap()
    .maxDistance(12)
    .onEnd(({ x }) => {
      'worklet';
      if (containerWidth === 0) return;

      const tappedIndex = positionToIndex(x, translateX.value);
      const didChange = tappedIndex !== lastIndex.value;

      if (didChange) {
        runOnJS(triggerHaptic)();
      }

      runOnJS(updateDisplayedFilter)(tappedIndex);
      runOnJS(snapToIndex)(tappedIndex);
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // ---- Derive displayed filter name from the swatch currently under center.
  const displayedFilter =
    FILTERS[displayedIndex] ?? getFilterById(activeFilterId) ?? FILTERS[0];

  return (
    <View style={styles.wrapper}>
      {/* Filter name label */}
      <Text style={styles.filterName}>{displayedFilter?.name ?? ''}</Text>

      <View style={styles.ribbonOuter}>
        <GestureDetector gesture={composedGesture}>
          <View style={styles.ribbonContainer}>
            <View style={styles.ribbonViewport}>
              {/* Skia canvas for swatch rectangles */}
              <Animated.View style={[styles.swatchRow, animatedRowStyle]}>
                <Canvas style={{ width: CONTENT_WIDTH, height: SWATCH_HEIGHT }}>
                  {FILTERS.map((filter, index) => (
                    <RoundedRect
                      key={filter.id}
                      x={index * SWATCH_STRIDE}
                      y={0}
                      width={SWATCH_WIDTH}
                      height={SWATCH_HEIGHT}
                      r={SWATCH_RADIUS}
                      color={filter.dominantColor}
                    />
                  ))}
                </Canvas>
              </Animated.View>

              <View
                pointerEvents="none"
                style={[
                  styles.selectionFrame,
                  { backgroundColor: withAlpha(displayedFilter?.dominantColor ?? colors.textPrimary, 0.18) },
                ]}
              />
            </View>

            <View pointerEvents="none" style={styles.selectionIndicatorTop} />
            <View pointerEvents="none" style={styles.selectionIndicatorBottom} />
          </View>
        </GestureDetector>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) => ({
  wrapper: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  filterName: {
    ...typography.captionMedium,
    color: theme.colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  ribbonOuter: {
    width: '100%',
    height: RIBBON_HEIGHT,
    overflow: 'hidden',
  },
  ribbonContainer: {
    flex: 1,
    position: 'relative',
  },
  ribbonViewport: {
    position: 'absolute',
    top: RIBBON_VIEWPORT_TOP,
    right: 0,
    left: 0,
    height: SWATCH_HEIGHT,
    overflow: 'hidden',
  },
  selectionFrame: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: SWATCH_WIDTH,
    height: SWATCH_HEIGHT,
    marginLeft: -SWATCH_WIDTH / 2,
    borderRadius: SWATCH_RADIUS,
    borderWidth: 2,
    borderColor: theme.colors.selectionBorder,
  },
  selectionIndicatorTop: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 0,
    height: 0,
    marginLeft: -INDICATOR_SIZE / 2,
    borderLeftWidth: INDICATOR_SIZE / 2,
    borderRightWidth: INDICATOR_SIZE / 2,
    borderTopWidth: INDICATOR_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.selectionBorder,
  },
  selectionIndicatorBottom: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: 0,
    marginLeft: -INDICATOR_SIZE / 2,
    borderLeftWidth: INDICATOR_SIZE / 2,
    borderRightWidth: INDICATOR_SIZE / 2,
    borderBottomWidth: INDICATOR_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.selectionBorder,
  },
  swatchRow: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
