import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLiveCount, formatCount } from '../hooks/useLiveCount';
import { COLORS, FONTS, SIZES, RADIUS } from '../theme';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Completed'>;

export default function CompletedScreen({ route, navigation }: Props) {
  const { mysterySetName } = route.params;
  const { count } = useLiveCount();

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const ringsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 500);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 900);
    }

    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 120 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(ringsAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0f0025', '#220050', '#0f0025']} style={styles.flex}>
      <SafeAreaView style={styles.center}>

        {/* Anillos de luz */}
        <Animated.View
          style={[
            styles.ring,
            styles.ring3,
            { opacity: ringsAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.12] }) },
          ]}
          pointerEvents="none"
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring2,
            { opacity: ringsAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] }) },
          ]}
          pointerEvents="none"
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring1,
            { opacity: ringsAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.25] }) },
          ]}
          pointerEvents="none"
        />

        <Animated.View
          style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        >
          {/* Icono */}
          <View style={styles.crownContainer}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>

          <Text style={styles.title}>Rosario completo</Text>
          <Text style={styles.subtitle}>{mysterySetName}</Text>

          <View style={styles.divider} />

          <Text style={styles.message}>
            Has terminado de rezar el Santo Rosario.{'\n'}
            Que la Virgen María interceda por ti.
          </Text>

          {/* Comunidad */}
          <View style={styles.communityCard}>
            <Text style={styles.communityCount}>{formatCount(count)}</Text>
            <Text style={styles.communityLabel}>
              personas rezaron contigo hoy en todo el mundo
            </Text>
          </View>

          {/* Versículo final */}
          <Text style={styles.verse}>
            "He aquí la esclava del Señor;{'\n'}hágase en mí según tu palabra."
          </Text>
          <Text style={styles.verseRef}>— Lc 1,38</Text>

          {/* Botones */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.replace('Home')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#e8c84a', '#c4991e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtnGrad}
            >
              <Text style={styles.primaryBtnText}>Volver al inicio</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.replace('Pray', { mysterySetId: undefined })}
            activeOpacity={0.75}
          >
            <Text style={styles.secondaryBtnText}>Rezar otro Rosario</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
    zIndex: 2,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.goldDim,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  crownEmoji: {
    fontSize: 40,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.xxxl,
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.md,
    color: COLORS.gold,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: COLORS.gold,
    borderRadius: 1,
    marginVertical: 20,
    opacity: 0.6,
  },
  message: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.md,
    color: COLORS.pearl,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.85,
    marginBottom: 24,
  },
  communityCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginBottom: 24,
  },
  communityCount: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.xxl,
    color: COLORS.goldLight,
  },
  communityLabel: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.sm,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  verse: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.md,
    color: COLORS.pearl,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    opacity: 0.7,
    marginBottom: 4,
  },
  verseRef: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xs,
    color: COLORS.muted,
    marginBottom: 32,
  },
  primaryBtn: {
    width: '100%',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 12,
  },
  primaryBtnGrad: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.lg,
    color: '#1a0a00',
  },
  secondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  secondaryBtnText: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.md,
    color: COLORS.muted,
  },
  // Anillos decorativos
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  ring1: { width: 200, height: 200 },
  ring2: { width: 320, height: 320 },
  ring3: { width: 460, height: 460 },
});
