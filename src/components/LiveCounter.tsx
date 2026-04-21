import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useLiveCount, formatCount } from '../hooks/useLiveCount';
import { COLORS, FONTS, SIZES } from '../theme';

export default function LiveCounter() {
  const { count, message } = useLiveCount();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(count);

  useEffect(() => {
    if (prevCount.current !== count) {
      prevCount.current = count;
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [count, pulseAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <View style={styles.textBlock}>
        <View style={styles.countRow}>
          <Animated.Text
            style={[styles.count, { transform: [{ scale: pulseAnim }] }]}
          >
            {formatCount(count)}
          </Animated.Text>
          <Text style={styles.label}> personas rezando ahora</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ade80',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  textBlock: {
    flex: 1,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  count: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.xl,
    color: COLORS.goldLight,
  },
  label: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.sm,
    color: COLORS.muted,
  },
  message: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xs,
    color: COLORS.faint,
    marginTop: 2,
  },
});
