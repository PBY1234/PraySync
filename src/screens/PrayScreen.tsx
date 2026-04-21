import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  useTrackPlayerEvents,
  Event as TPEvent,
} from 'react-native-track-player';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useRosary } from '../hooks/useRosary';
import BeadProgress from '../components/BeadProgress';
import MysteryOverlay from '../components/MysteryOverlay';
import {
  setupTrackPlayer,
  teardownTrackPlayer,
  updateLockScreen,
  getLockScreenLines,
} from '../services/trackPlayer';
import { COLORS, FONTS, SIZES, RADIUS } from '../theme';
import type { MysterySetId } from '../constants/rosary';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Pray'>;

// ─── Contenido heroico según tipo de paso ─────────────────────────────────────

function StepHero({
  step,
  mysteryTitle,
  glowAnim,
}: {
  step: ReturnType<typeof useRosary>['currentStep'];
  mysteryTitle: string;
  glowAnim: Animated.Value;
}) {
  if (step.type === 'hail_mary') {
    const isIntro = step.decade === undefined;
    const num = step.beadInDecade ?? 1;
    const total = isIntro ? 3 : 10;
    return (
      <View style={hero.container}>
        <Text style={hero.label}>Avemaría</Text>
        <View style={hero.countRow}>
          <Text style={hero.countBig}>{num}</Text>
          <Text style={hero.countSep}>/</Text>
          <Text style={hero.countTotal}>{total}</Text>
        </View>
        {isIntro && (
          <Text style={hero.sub}>
            {num === 1 ? 'por la Fe' : num === 2 ? 'por la Esperanza' : 'por la Caridad'}
          </Text>
        )}
      </View>
    );
  }

  if (step.type === 'our_father') {
    return (
      <View style={hero.container}>
        <Text style={hero.prayerName}>Padre{'\n'}Nuestro</Text>
        {mysteryTitle ? <Text style={hero.sub}>{mysteryTitle}</Text> : null}
      </View>
    );
  }

  if (step.type === 'glory_be') {
    return (
      <Animated.View
        style={[
          hero.container,
          {
            opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.85] }),
          },
        ]}
      >
        <Animated.Text
          style={[
            hero.gloryText,
            {
              transform: [
                {
                  scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.06],
                  }),
                },
              ],
            },
          ]}
        >
          Gloria
        </Animated.Text>
        {step.decade !== undefined && (
          <Text style={hero.gloryDecade}>{step.decade}° decenio completado</Text>
        )}
      </Animated.View>
    );
  }

  if (step.type === 'sign_of_cross' || step.type === 'sign_of_cross_final') {
    return (
      <View style={hero.container}>
        <Text style={hero.symbol}>✝</Text>
        <Text style={hero.label}>Señal de la Cruz</Text>
      </View>
    );
  }

  if (step.type === 'fatima') {
    return (
      <View style={hero.container}>
        <Text style={hero.prayerName}>Jaculatoria{'\n'}de Fátima</Text>
      </View>
    );
  }

  if (step.type === 'salve') {
    return (
      <View style={hero.container}>
        <Text style={hero.prayerName}>Salve{'\n'}Regina</Text>
      </View>
    );
  }

  // creed, closing, mystery_announce
  const labels: Record<string, string> = {
    creed: 'Credo',
    closing: 'Oración\nFinal',
    mystery_announce: '…',
  };
  return (
    <View style={hero.container}>
      <Text style={hero.prayerName}>{labels[step.type] ?? step.type}</Text>
    </View>
  );
}

// ─── Pantalla principal ────────────────────────────────────────────────────────

export default function PrayScreen({ route, navigation }: Props) {
  const mysterySetId = route.params?.mysterySetId as MysterySetId | undefined;
  const rosary = useRosary(mysterySetId);
  const {
    mysterySet,
    currentStep,
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
  const [playerReady, setPlayerReady] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  // ── Setup TrackPlayer ──────────────────────────────────────────────────────
  useEffect(() => {
    setupTrackPlayer().then(() => setPlayerReady(true));
    return () => { teardownTrackPlayer(); };
  }, []);

  // ── Escuchar botones de volumen / auricular / pantalla bloqueada ───────────
  useTrackPlayerEvents(
    [TPEvent.RemoteNext, TPEvent.RemotePrevious],
    useCallback(
      (event) => {
        if (event.type === TPEvent.RemoteNext) handleAdvance();
        else if (event.type === TPEvent.RemotePrevious) handleGoBack();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentIndex],
    ),
  );

  // ── Mostrar overlay de misterio ───────────────────────────────────────────
  useEffect(() => {
    if (currentStep.type === 'mystery_announce') setShowOverlay(true);
  }, [currentStep]);

  // ── Actualizar pantalla bloqueada en cada paso ────────────────────────────
  useEffect(() => {
    if (!playerReady) return;
    const { title, artist } = getLockScreenLines(
      currentStep,
      mysterySet,
      currentIndex,
      totalSteps,
    );
    updateLockScreen(title, artist);
  }, [currentIndex, playerReady]);

  // ── Gloria: haptic + animación + toast ───────────────────────────────────
  useEffect(() => {
    if (!decadeComplete) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 350);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 650);
    }
    Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    if (currentStep.decade !== undefined) {
      showToastMsg(`${currentStep.decade}° decenio ✓`);
    }
  }, [decadeComplete]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const triggerFade = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.2, duration: 70, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  const handleAdvance = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    triggerFade();
    if (currentIndex >= totalSteps - 1) {
      navigation.replace('Completed', { mysterySetName: mysterySet.name });
    } else {
      advance();
    }
  }, [currentIndex, totalSteps]);

  const handleGoBack = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    triggerFade();
    goBack();
  }, []);

  function showToastMsg(msg: string) {
    setToastText(msg);
    setShowToast(true);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(toastAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const gradColors = COLORS.bg[mysterySet.id] as [string, string];
  const mystery =
    decadeIndex >= 0 ? mysterySet.mysteries[decadeIndex] : null;
  const mysteryTitle = mystery ? `${mystery.number}° · ${mystery.title}` : '';

  const showBeads =
    (currentStep.type === 'hail_mary' ||
      currentStep.type === 'glory_be' ||
      currentStep.type === 'fatima' ||
      currentStep.type === 'our_father') &&
    currentStep.decade !== undefined;

  return (
    <LinearGradient colors={gradColors} style={s.flex}>
      <SafeAreaView style={s.flex}>

        {/* ── Barra superior ── */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.closeBtn}>
            <Text style={s.closeTxt}>✕</Text>
          </TouchableOpacity>
          <View style={s.progTrack}>
            <View style={[s.progFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={s.stepTxt}>{currentIndex + 1}/{totalSteps}</Text>
        </View>

        {/* ── Badge de misterio ── */}
        {mystery && (
          <View style={s.badge}>
            <Text style={s.badgeTxt} numberOfLines={1}>
              {mysterySet.emoji}  {mysterySet.name}  ·  {mystery.number}°
            </Text>
          </View>
        )}

        {/* ── Zonas táctiles laterales (todo el alto de la pantalla) ── */}
        <TouchableOpacity style={s.tapLeft} onPress={handleGoBack} activeOpacity={1} />
        <TouchableOpacity style={s.tapRight} onPress={handleAdvance} activeOpacity={1} />

        {/* ── Glow dorado en Gloria ── */}
        <Animated.View
          style={[s.gloryGlow, { opacity: glowAnim }]}
          pointerEvents="none"
        />

        {/* ── Contenido heroico central ── */}
        <Animated.View style={[s.heroWrap, { opacity: fadeAnim }]}>
          <StepHero
            step={currentStep}
            mysteryTitle={mysteryTitle}
            glowAnim={glowAnim}
          />
        </Animated.View>

        {/* ── Cuentas del decenio ── */}
        {showBeads && (
          <View style={s.beadsWrap}>
            <BeadProgress
              completed={beadInDecade}
              isGloryMoment={decadeComplete}
            />
          </View>
        )}

        {/* ── Hints de tap ── */}
        <View style={s.hints} pointerEvents="none">
          <Text style={s.hintTxt}>‹</Text>
          <Text style={s.hintTxt}>›</Text>
        </View>

      </SafeAreaView>

      {/* ── Overlay de misterio ── */}
      {showOverlay && mystery && (
        <MysteryOverlay
          visible={showOverlay}
          mystery={mystery}
          mysterySet={mysterySet}
          onContinue={() => { setShowOverlay(false); advance(); }}
        />
      )}

      {/* ── Toast de decenio completo ── */}
      {showToast && (
        <Animated.View style={[s.toast, { opacity: toastAnim }]}>
          <Text style={s.toastTxt}>{toastText}</Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
}

// ─── Estilos hero ──────────────────────────────────────────────────────────────
const hero = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.md,
    color: COLORS.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  countBig: {
    fontFamily: FONTS.serif,
    fontSize: 110,
    color: COLORS.white,
    lineHeight: 120,
    includeFontPadding: false,
  },
  countSep: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xl,
    color: COLORS.muted,
    marginBottom: 18,
  },
  countTotal: {
    fontFamily: FONTS.serif,
    fontSize: 52,
    color: COLORS.muted,
    lineHeight: 66,
    includeFontPadding: false,
  },
  sub: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.sm,
    color: COLORS.gold,
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  prayerName: {
    fontFamily: FONTS.serif,
    fontSize: 52,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 62,
    letterSpacing: 0.5,
  },
  gloryText: {
    fontFamily: FONTS.serif,
    fontSize: 72,
    color: COLORS.gold,
    textAlign: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
  },
  gloryDecade: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.md,
    color: COLORS.goldLight,
    letterSpacing: 0.5,
  },
  symbol: {
    fontFamily: FONTS.serif,
    fontSize: 72,
    color: COLORS.pearl,
  },
});

// ─── Estilos pantalla ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 10,
  },
  closeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontFamily: FONTS.sans, fontSize: SIZES.lg, color: COLORS.faint },
  progTrack: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 1 },
  stepTxt: { fontFamily: FONTS.sans, fontSize: SIZES.xs, color: COLORS.faint, minWidth: 40, textAlign: 'right' },
  badge: {
    alignSelf: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.full,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  badgeTxt: { fontFamily: FONTS.sans, fontSize: SIZES.xs, color: COLORS.gold, letterSpacing: 0.3 },
  // Zonas táctiles — cubre todo el alto menos top/bottom bar
  tapLeft: {
    position: 'absolute',
    left: 0, top: 80, bottom: 80,
    width: '42%',
    zIndex: 10,
  },
  tapRight: {
    position: 'absolute',
    right: 0, top: 80, bottom: 80,
    width: '42%',
    zIndex: 10,
  },
  // Gloria glow
  gloryGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(212,175,55,0.10)',
    zIndex: 0,
  },
  // Hero
  heroWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    paddingHorizontal: 24,
  },
  // Cuentas
  beadsWrap: {
    paddingBottom: 10,
    zIndex: 5,
  },
  // Hints
  hints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 12,
    zIndex: 5,
  },
  hintTxt: {
    fontFamily: FONTS.sans,
    fontSize: 22,
    color: 'rgba(255,255,255,0.18)',
  },
  // Toast
  toast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(212,175,55,0.95)',
    borderRadius: RADIUS.full,
    paddingVertical: 9,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  toastTxt: { fontFamily: FONTS.sansBold, fontSize: SIZES.sm, color: '#1a0a00' },
});
