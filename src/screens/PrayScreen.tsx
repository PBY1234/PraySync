import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  Vibration,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRosary } from '../hooks/useRosary';
import BeadProgress from '../components/BeadProgress';
import MysteryOverlay from '../components/MysteryOverlay';
import { COLORS, FONTS, SIZES, RADIUS } from '../theme';
import type { MysterySetId } from '../constants/rosary';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Pray'>;

export default function PrayScreen({ route, navigation }: Props) {
  const mysterySetId = route.params?.mysterySetId as MysterySetId | undefined;
  const rosary = useRosary(mysterySetId);
  const {
    mysterySet,
    currentStep,
    prayerTitle,
    prayerText,
    currentIndex,
    totalSteps,
    progress,
    decadeIndex,
    beadInDecade,
    decadeComplete,
    advance,
    goBack,
  } = rosary;

  const [showOverlay, setShowOverlay] = useState(false);
  const [toastText, setToastText] = useState('');
  const [showToast, setShowToast] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const gloryGlow = useRef(new Animated.Value(0)).current;

  // Mostrar overlay de misterio
  useEffect(() => {
    if (currentStep.type === 'mystery_announce') {
      setShowOverlay(true);
    }
  }, [currentStep]);

  // Haptic + animación en Gloria
  useEffect(() => {
    if (decadeComplete) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 300);
      }
      Animated.sequence([
        Animated.timing(gloryGlow, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(gloryGlow, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start();
      if (currentStep.decade !== undefined) {
        showToastMessage(`${currentStep.decade}º decenio completado ✓`);
      }
    }
  }, [decadeComplete, currentStep.decade]);

  // Haptic suave en avanzar
  function onAdvance() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Animación de fade al cambiar oración
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.3, duration: 80, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    if (currentIndex >= totalSteps - 1) {
      navigation.replace('Completed', {
        mysterySetName: mysterySet.name,
      });
    } else {
      advance();
    }
  }

  function onBack() {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.3, duration: 80, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    goBack();
  }

  function showToastMessage(msg: string) {
    setToastText(msg);
    setShowToast(true);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  }

  const gradientColors = COLORS.bg[mysterySet.id] as [string, string];
  const stepLabel = `${currentIndex + 1} / ${totalSteps}`;
  const isMysteryAnnounce = currentStep.type === 'mystery_announce';
  const mystery =
    currentStep.decade !== undefined
      ? mysterySet.mysteries[currentStep.decade - 1]
      : null;

  const showBeads =
    currentStep.type === 'hail_mary' ||
    currentStep.type === 'glory_be' ||
    currentStep.type === 'fatima' ||
    currentStep.type === 'our_father';

  return (
    <LinearGradient colors={gradientColors} style={styles.flex}>
      <SafeAreaView style={styles.flex}>

        {/* Barra superior */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.stepLabel}>{stepLabel}</Text>
        </View>

        {/* Misterio activo (si aplica) */}
        {decadeIndex >= 0 && mystery && (
          <View style={styles.mysteryBadge}>
            <Text style={styles.mysteryBadgeText}>
              {mysterySet.emoji}  {mystery.number}. {mystery.title}
            </Text>
          </View>
        )}

        {/* Zona táctil izquierda (retroceder) */}
        <TouchableOpacity
          style={styles.tapZoneLeft}
          onPress={onBack}
          activeOpacity={0.6}
        />

        {/* Zona táctil derecha (avanzar) */}
        <TouchableOpacity
          style={styles.tapZoneRight}
          onPress={onAdvance}
          activeOpacity={0.6}
        />

        {/* Glória glow */}
        <Animated.View
          style={[
            styles.gloryGlow,
            {
              opacity: gloryGlow,
              transform: [{ scale: gloryGlow.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.1] }) }],
            },
          ]}
          pointerEvents="none"
        />

        {/* Tarjeta de oración */}
        <View style={styles.prayerContainer}>
          <Animated.View style={[styles.prayerCard, { opacity: fadeAnim }]}>
            <Text style={styles.prayerTitle}>{prayerTitle}</Text>
            <View style={styles.prayerDivider} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.prayerScrollContent}
            >
              <Text style={styles.prayerText}>{prayerText}</Text>
            </ScrollView>
          </Animated.View>
        </View>

        {/* Cuentas del decenio */}
        {showBeads && (
          <View style={styles.beadsRow}>
            <BeadProgress
              completed={beadInDecade}
              isGloryMoment={decadeComplete}
            />
            {currentStep.type === 'hail_mary' && currentStep.beadInDecade !== undefined && (
              <Text style={styles.beadCount}>
                {currentStep.beadInDecade} / 10
              </Text>
            )}
          </View>
        )}

        {/* Indicadores de tap */}
        <View style={styles.tapHints} pointerEvents="none">
          <Text style={styles.tapHintText}>‹ atrás</Text>
          <Text style={styles.tapHintText}>siguiente ›</Text>
        </View>

      </SafeAreaView>

      {/* Overlay de misterio */}
      {showOverlay && mystery && (
        <MysteryOverlay
          visible={showOverlay}
          mystery={mystery}
          mysterySet={mysterySet}
          onContinue={() => {
            setShowOverlay(false);
            advance();
          }}
        />
      )}

      {/* Toast */}
      {showToast && (
        <Animated.View style={[styles.toast, { opacity: toastAnim }]}>
          <Text style={styles.toastText}>{toastText}</Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.lg,
    color: 'rgba(255,255,255,0.5)',
  },
  progressBarContainer: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  stepLabel: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xs,
    color: COLORS.muted,
    minWidth: 44,
    textAlign: 'right',
  },
  mysteryBadge: {
    marginHorizontal: 20,
    marginBottom: 6,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'center',
  },
  mysteryBadgeText: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xs,
    color: COLORS.gold,
    letterSpacing: 0.3,
  },
  // Zonas táctiles laterales (invisibles)
  tapZoneLeft: {
    position: 'absolute',
    left: 0,
    top: 120,
    bottom: 120,
    width: '40%',
    zIndex: 10,
  },
  tapZoneRight: {
    position: 'absolute',
    right: 0,
    top: 120,
    bottom: 120,
    width: '40%',
    zIndex: 10,
  },
  // Glow para el Gloria
  gloryGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(212,175,55,0.08)',
    zIndex: 0,
  },
  // Tarjeta de oración
  prayerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'center',
  },
  prayerCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: 28,
    maxHeight: '80%',
  },
  prayerTitle: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.xl,
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  prayerDivider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginBottom: 18,
  },
  prayerScrollContent: {
    paddingBottom: 4,
  },
  prayerText: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.lg,
    color: COLORS.pearl,
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  // Cuentas
  beadsRow: {
    paddingBottom: 12,
    paddingTop: 4,
    alignItems: 'center',
    gap: 6,
  },
  beadCount: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.sm,
    color: COLORS.gold,
    opacity: 0.85,
  },
  // Hints de tap
  tapHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  tapHintText: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xs,
    color: COLORS.faint,
    letterSpacing: 0.5,
  },
  // Toast
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(212,175,55,0.92)',
    borderRadius: RADIUS.full,
    paddingVertical: 10,
    paddingHorizontal: 22,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  toastText: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.sm,
    color: '#1a0a00',
    letterSpacing: 0.3,
  },
});
