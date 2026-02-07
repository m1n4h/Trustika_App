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

/**
 * TOUR STEPS CONFIGURATION
 * 
 * Define all tour steps here. Each step includes:
 * - id: unique identifier
 * - title: header text in tooltip
 * - description: help text
 * - icon: MaterialIcon name (for future use)
 */
const TOUR_STEPS = [
  {
    id: 'food',
    title: 'Trustika Food',
    description: 'Here is the place to order delicious food.',
    icon: 'restaurant',
  },
  {
    id: 'pharmacy',
    title: 'Trustika Pharmacy',
    description: 'Order pharmacies or medicines now.',
    icon: 'local-pharmacy',
  },
  {
    id: 'sendto',
    title: 'Send To',
    description: 'Order a ride or send parcels here.',
    icon: 'local-shipping',
  },
];

/**
 * TARGET POSITION INTERFACE
 * 
 * Represents the measured position and size of a target element
 * Obtained from View.measureInWindow()
 */
interface TargetPosition {
  x: number;      // Absolute X coordinate from left edge
  y: number;      // Absolute Y coordinate from top edge
  width: number;  // Component width in pixels
  height: number; // Component height in pixels
}

/**
 * HOME GUIDE TOUR COMPONENT PROPS
 * 
 * visible: Boolean to show/hide the tour modal
 * onClose: Callback fired when tour closes (skip or completion)
 * targetPositions: Object containing measured positions of all targets
 * isDarkMode: Boolean to toggle theme colors
 * colors: Theme colors object from ThemeContext
 */
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

/**
 * HOME GUIDE TOUR COMPONENT
 * 
 * A production-ready guided tour overlay that teaches users about the app's main features.
 * 
 * FEATURES:
 * - Animated arrow with smooth bezier easing and bounce effect
 * - Spotlight overlay highlighting the current target
 * - Context-aware tooltips with Next/Skip buttons
 * - Runtime position measurement for responsive layout
 * - Dark mode support
 * - One-time display with AsyncStorage persistence
 * 
 * USAGE:
 * <HomeGuideTour
 *   visible={tourVisible}
 *   onClose={() => setTourVisible(false)}
 *   targetPositions={targetPositions}
 *   isDarkMode={isDarkMode}
 *   colors={colors}
 * />
 */
export const HomeGuideTour = ({
  visible,
  onClose,
  targetPositions,
  isDarkMode,
  colors,
}: HomeGuideTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Shared animation values for Reanimated
  const arrowProgress = useSharedValue(0);  // 0 = start, 1 = at target
  const pulseAnim = useSharedValue(0);      // Pulse/bounce animation

  /**
   * ARROW ANIMATED STYLE
   * 
   * Animates the arrow position from start to target position.
   * The path is calculated using interpolation:
   * - X axis: moves horizontally to target center
   * - Y axis: moves vertically above target
   * - Rotation: rotates to point toward target
   * - Opacity: fades in as arrow travels
   */
  const arrowAnimatedStyle = useAnimatedStyle(() => {
    const currentTarget = getTargetPosition(currentStep);
    if (!currentTarget) return {};

    const startPos = currentStep === 0 
      ? { x: width / 2, y: 100 } 
      : getTargetPosition(currentStep - 1);

    // Linear interpolation of X coordinate
    const x = interpolate(
      arrowProgress.value,
      [0, 1],
      [startPos?.x ?? width / 2, currentTarget.x],
      Extrapolate.CLAMP
    );

    // Linear interpolation of Y coordinate
    const y = interpolate(
      arrowProgress.value,
      [0, 1],
      [startPos?.y ?? 100, currentTarget.y - 80],
      Extrapolate.CLAMP
    );

    // Calculate rotation angle based on step
    // This makes the arrow point toward the target
    let rotation = 0;
    if (currentStep === 0) {
      rotation = -90 + (arrowProgress.value * 180);
    } else if (currentStep === 1) {
      rotation = 90 + (arrowProgress.value * 0);
    } else {
      rotation = 90 + (arrowProgress.value * -90);
    }

    return {
      transform: [
        { translateX: x - 24 },
        { translateY: y - 24 },
        { rotate: `${rotation}deg` },
      ],
      opacity: arrowProgress.value,
    };
  });

  /**
   * PULSE ANIMATED STYLE
   * 
   * Creates a subtle pulse/bounce effect when arrow arrives at target.
   * Scales from 1.0 to 1.2 and back, with opacity pulsing.
   */
  const pulseAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pulseAnim.value, 
      [0, 1], 
      [1, 1.2], 
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      pulseAnim.value, 
      [0, 0.5, 1], 
      [1, 0.6, 1], 
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  /**
   * TOOLTIP ANIMATED STYLE
   * 
   * Tooltip fades in after arrow has traveled 70% of the way to target.
   * This creates a natural reveal as the arrow approaches.
   */
  const tooltipAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        arrowProgress.value, 
        [0.7, 1], 
        [0, 1], 
        Extrapolate.CLAMP
      ),
    };
  });

  /**
   * GET TARGET POSITION BY STEP
   * 
   * Returns the measured position for the current tour step.
   * Maps array index to target position object.
   */
  const getTargetPosition = (step: number): TargetPosition | null => {
    const keys: (keyof typeof targetPositions)[] = ['food', 'pharmacy', 'sendto'];
    return targetPositions[keys[step]] || null;
  };

  /**
   * ANIMATION SEQUENCE EFFECT
   * 
   * Triggers when:
   * - Tour becomes visible
   * - User advances to next step
   * 
   * Sequence:
   * 1. Arrow travels to target (1200ms, bezier easing)
   * 2. After 1200ms, pulse animation starts (600ms)
   * 3. Arrow waits at target until user clicks Next (4000ms+ total)
   */
  useEffect(() => {
    if (!visible || !getTargetPosition(currentStep)) return;

    // Animate arrow arrival with smooth bezier easing
    // This easing function (0.25, 0.46, 0.45, 0.94) provides a natural feel
    arrowProgress.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { 
        duration: 1200, 
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) 
      })
    );

    // Start pulse animation after arrow arrives
    const pulseTimer = setTimeout(() => {
      pulseAnim.value = withSequence(
        withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withDelay(400, withTiming(0, { duration: 600, easing: Easing.in(Easing.cubic) }))
      );
    }, 1200);

    return () => clearTimeout(pulseTimer);
  }, [currentStep, visible]);

  /**
   * HANDLE NEXT STEP
   * 
   * Advances to next step or closes tour if on last step.
   * On tour completion, updates AsyncStorage to prevent re-showing.
   */
  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCloseTour();
    }
  };

  /**
   * HANDLE CLOSE TOUR
   * 
   * Called when user clicks Skip or completes the tour.
   * Marks tour as completed in AsyncStorage so it won't show again.
   */
  const handleCloseTour = async () => {
    await AsyncStorage.setItem('tour_completed', 'true');
    onClose();
  };

  // Get current step data
  const currentTourStep = TOUR_STEPS[currentStep];
  const targetPos = getTargetPosition(currentStep);

  // Don't render if tour is hidden or no target position
  if (!visible || !targetPos) {
    return null;
  }

  // Calculate tooltip position (above target, centered)
  const tooltipTop = targetPos.y + targetPos.height + 30;
  const tooltipLeft = Math.max(16, Math.min(targetPos.x - 60, width - 232));

  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* SEMI-TRANSPARENT OVERLAY */}
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        
        {/* SPOTLIGHT - Highlights the current target */}
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

        {/* ANIMATED ARROW */}
        <Animated.View style={[styles.arrowWrapper, arrowAnimatedStyle]}>
          <Animated.View style={pulseAnimatedStyle}>
            <MaterialIcons 
              name="arrow-downward" 
              size={48} 
              color="#F97316"  // Change this to customize arrow color
            />
          </Animated.View>
        </Animated.View>

        {/* TOOLTIP CALLOUT */}
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
          {/* Small pointer triangle at top */}
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

          {/* Tooltip Content */}
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

          {/* Action Buttons */}
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

/**
 * STYLES
 * 
 * All styles are defined here for easy customization.
 * Colors are mostly hardcoded but can be made dynamic in the component props.
 */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  
  // Spotlight circle around target element
  spotlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F97316',
    boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)',
  },
  
  // Container for arrow
  arrowWrapper: {
    position: 'absolute',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Tooltip container
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
  
  // Small triangle pointer at top of tooltip
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
  
  // Tooltip text area
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
  
  // Button container
  tooltipButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  
  // Skip button (ghost style)
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
  
  // Next button (solid style)
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
