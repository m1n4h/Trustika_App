import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  runOnJS,
  Extrapolate,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Tour steps configuration
const TOUR_STEPS = [
  {
    id: 'food',
    title: 'Order Food',
    description: 'Here is the place to order delicious food.',
    icon: 'restaurant',
  },
  {
    id: 'pharmacy',
    title: 'Order Medicine',
    description: 'Order medicines quickly.',
    icon: 'medication',
  },
  {
    id: 'sendto',
    title: 'Send To',
    description: 'Order a ride or send parcels here.',
    icon: 'local-shipping',
  },
];

interface TargetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface HomeGuideTourProps {
  visible: boolean;
  onClose: () => void;
  targetPositions: {
    food: TargetPosition | null;
    pharmacy: TargetPosition | null;
    sendto: TargetPosition | null;
  };
  isDarkMode: boolean;
  colors: any;
}

export const HomeGuideTour = ({
  visible,
  onClose,
  targetPositions,
  isDarkMode,
  colors,
}: HomeGuideTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const arrowProgress = useSharedValue(0);
  const pulseAnim = useSharedValue(0);
  const targetXValue = useSharedValue(0);
  const targetYValue = useSharedValue(0);
  const startXValue = useSharedValue(width / 2);
  const startYValue = useSharedValue(100);
  const stepValue = useSharedValue(0);

  // Get target position by step
  const getTargetPosition = (step: number): TargetPosition | null => {
    const keys: (keyof typeof targetPositions)[] = ['food', 'pharmacy', 'sendto'];
    return targetPositions[keys[step]] || null;
  };

  // Update shared values when step or positions change
  useEffect(() => {
    const currentTarget = getTargetPosition(currentStep);
    if (!currentTarget) return;
    // Use center of the target for better pointing
    targetXValue.value = currentTarget.x + currentTarget.width / 2;
    targetYValue.value = currentTarget.y + currentTarget.height / 2;
    stepValue.value = currentStep;

    if (currentStep === 0) {
      startXValue.value = width / 2;
      startYValue.value = 100;
    } else {
      const prevTarget = getTargetPosition(currentStep - 1);
      startXValue.value = (prevTarget?.x ?? width / 2) + ((prevTarget?.width ?? 0) / 2);
      startYValue.value = (prevTarget?.y ?? 100) + ((prevTarget?.height ?? 0) / 2);
    }
  }, [currentStep, targetPositions]);

  // Animated values for arrow
  const arrowAnimatedStyle = useAnimatedStyle(() => {
    const x = interpolate(
      arrowProgress.value,
      [0, 1],
      [startXValue.value, targetXValue.value],
      Extrapolate.CLAMP
    );

    const y = interpolate(
      arrowProgress.value,
      [0, 1],
      [startYValue.value, targetYValue.value],
      Extrapolate.CLAMP
    );

    // Calculate rotation angle
    // Compute angle from start -> target so arrow points correctly
    const dx = targetXValue.value - startXValue.value;
    const dy = targetYValue.value - startYValue.value;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const rotation = angle + 90; // degrees - offset because icon points down by default

    return {
      transform: [
        { translateX: x - 24 },
        { translateY: y - 24 },
        { rotate: `${rotation}deg` },
      ],
      opacity: arrowProgress.value,
    };
  });

  // Pulse animation for arrow
  const pulseAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnim.value, [0, 1], [1, 1.2], Extrapolate.CLAMP);
    const opacity = interpolate(pulseAnim.value, [0, 0.5, 1], [1, 0.6, 1], Extrapolate.CLAMP);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const tooltipAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(arrowProgress.value, [0.7, 1], [0, 1], Extrapolate.CLAMP),
    };
  });

  // Start animation sequence
  useEffect(() => {
    if (!visible || !getTargetPosition(currentStep)) return;

    // Animate arrow arrival
    arrowProgress.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { duration: 1200, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) })
    );

    // Pulse animation on arrival
    const pulseTimer = setTimeout(() => {
      pulseAnim.value = withSequence(
        withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withDelay(400, withTiming(0, { duration: 600, easing: Easing.in(Easing.cubic) }))
      );
    }, 1200);

    return () => clearTimeout(pulseTimer);
  }, [currentStep, visible]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCloseTour();
    }
  };

  const handleCloseTour = async () => {
    await AsyncStorage.setItem('tour_completed', 'true');
    onClose();
  };

  const currentTourStep = TOUR_STEPS[currentStep];
  const targetPos = getTargetPosition(currentStep);

  if (!visible) {
    return null;
  }

  if (!targetPos) {
    return null;
  }

  // Calculate tooltip position and avoid covering the target or going off-screen
  const TOOLTIP_WIDTH = 200;
  const TOOLTIP_HEIGHT = 140; // approximate
  // prefer below the target
  let tooltipTop = targetPos.y + targetPos.height + 20;
  // if not enough space below, place above
  if (tooltipTop + TOOLTIP_HEIGHT > height - 20) {
    tooltipTop = targetPos.y - TOOLTIP_HEIGHT - 20;
  }
  // horizontal clamp
  const tooltipLeft = Math.max(16, Math.min(targetPos.x - TOOLTIP_WIDTH / 2 + targetPos.width / 2, width - TOOLTIP_WIDTH - 16));

  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* Semi-transparent overlay */}
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        {/* Spotlight on target */}
        <View
          style={[
            styles.spotlight,
            {
              left: targetPos.x - 12,
              top: targetPos.y - 12,
              width: targetPos.width + 24,
              height: targetPos.height + 24,
              borderRadius: 20,
            },
          ]}
        />

        {/* Animated Arrow */}
        <Animated.View style={[styles.arrowWrapper, arrowAnimatedStyle]}>
          <Animated.View style={pulseAnimatedStyle}>
            <MaterialIcons name="arrow-downward" size={48} color="#F97316" />
          </Animated.View>
        </Animated.View>

        {/* Tooltip */}
        <Animated.View
          style={[
            styles.tooltip,
            {
              top: tooltipTop,
              left: tooltipLeft,
              backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF',
              borderColor: '#F97316',
            },
            tooltipAnimatedStyle,
          ]}
        >
          {/* Pointer */}
          <View
            style={[
              styles.tooltipPointer,
              {
                borderBottomColor: isDarkMode ? '#2D3748' : '#FFFFFF',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
              },
            ]}
          />

          {/* Content */}
          <View style={styles.tooltipContent}>
            <Text
              style={[
                styles.tooltipTitle,
                { color: isDarkMode ? '#FFFFFF' : '#000000' },
              ]}
            >
              {currentTourStep.title}
            </Text>
            <Text
              style={[
                styles.tooltipDescription,
                { color: isDarkMode ? '#D1D5DB' : '#6B7280' },
              ]}
            >
              {currentTourStep.description}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.tooltipButtons}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleCloseTour}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: '#F97316' },
              ]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === TOUR_STEPS.length - 1 ? 'Got it' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  spotlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F97316',
    boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)',
  },
  arrowWrapper: {
    position: 'absolute',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F97316',
    width: 200,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tooltipPointer: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  tooltipContent: {
    marginTop: 8,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#000000',
  },
  tooltipDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
    marginBottom: 12,
  },
  tooltipButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F97316',
  },
  nextButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
