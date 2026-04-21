import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

interface Props {
  total?: number;       // siempre 10 para avemarías
  completed: number;    // cuántas completadas (0–10)
  isGloryMoment?: boolean;
}

export default function BeadProgress({ total = 10, completed, isGloryMoment }: Props) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isGloryMoment) {
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [isGloryMoment, glowAnim]);

  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < completed;
        const isActive = i === completed && !isGloryMoment;

        if (isActive) {
          return (
            <Animated.View
              key={i}
              style={[
                styles.bead,
                styles.beadActive,
                {
                  transform: [{ scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.15, 1.5],
                  }) }],
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.7],
                  }),
                },
              ]}
            />
          );
        }

        return (
          <View
            key={i}
            style={[
              styles.bead,
              isDone ? styles.beadDone : styles.beadFuture,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 16,
  },
  bead: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  beadActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.beadActive,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  beadDone: {
    backgroundColor: COLORS.beadDone,
  },
  beadFuture: {
    backgroundColor: COLORS.beadFuture,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
