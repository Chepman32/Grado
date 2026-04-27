import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import AnimatedPressable from '../shared/AnimatedPressable';
import {
  SPRING_MODAL_ENTER,
  SPRING_MODAL_EXIT,
  spacing,
  typography,
  useAppTheme,
  useThemedStyles,
  type AppTheme,
} from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';

interface NamePromptModalProps {
  visible: boolean;
  title: string;
  description: string;
  initialValue: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}

export default function NamePromptModal({
  visible,
  title,
  description,
  initialValue,
  confirmLabel,
  onCancel,
  onConfirm,
}: NamePromptModalProps): React.JSX.Element {
  const theme = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const colors = theme.colors;
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);
  const [isMounted, setIsMounted] = useState(visible);
  const inputRef = useRef<TextInput>(null);
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setValue(initialValue);
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 180);

    return () => clearTimeout(timeoutId);
  }, [initialValue, visible]);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!isMounted) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }

    cancelAnimation(progress);
    progress.value = withSpring(
      visible ? 1 : 0,
      visible ? SPRING_MODAL_ENTER : SPRING_MODAL_EXIT,
      (finished) => {
        if (finished && !visible) {
          runOnJS(setIsMounted)(false);
        }
      },
    );
  }, [isMounted, progress, visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.72, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [28, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.92, 1]) },
    ],
  }));

  const handleCancel = () => {
    Keyboard.dismiss();
    onCancel();
  };

  const handleConfirm = () => {
    Keyboard.dismiss();
    onConfirm(value);
  };

  return (
    <Modal
      visible={isMounted}
      animationType="none"
      transparent
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable
          accessibilityLabel="Close name prompt"
          accessibilityRole="button"
          onPress={handleCancel}
          style={StyleSheet.absoluteFill}
          testID="name-prompt-backdrop"
        >
          <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} />
        </Pressable>
        <Animated.View style={[styles.card, cardStyle]} testID="name-prompt-card">
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={setValue}
            style={styles.input}
            placeholderTextColor={colors.textTertiary}
            selectionColor={colors.accent}
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />
          <View style={styles.actions}>
            <AnimatedPressable onPress={handleCancel} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{t.cancelLabel}</Text>
            </AnimatedPressable>
            <AnimatedPressable onPress={handleConfirm} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{confirmLabel}</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (theme: AppTheme) => {
  const colors = theme.colors;

  return {
    overlay: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    backdrop: {
      backgroundColor: colors.overlay,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOpacity: theme.isDark ? 0.32 : 0.16,
      shadowRadius: 28,
      shadowOffset: {
        width: 0,
        height: 18,
      },
      elevation: 16,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    description: {
      ...typography.body,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    input: {
      ...typography.body,
      color: colors.textPrimary,
      backgroundColor: colors.surfaceLight,
      borderRadius: 14,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    secondaryButton: {
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surfaceLight,
    },
    secondaryButtonText: {
      ...typography.bodyMedium,
      color: colors.textPrimary,
    },
    primaryButton: {
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.accent,
    },
    primaryButtonText: {
      ...typography.bodyMedium,
      color: colors.accentForeground,
    },
  };
};
