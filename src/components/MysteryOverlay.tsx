import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { type Mystery, type MysterySet } from '../constants/rosary';
import { COLORS, FONTS, SIZES, RADIUS } from '../theme';

interface Props {
  visible: boolean;
  mystery: Mystery;
  mysterySet: MysterySet;
  onContinue: () => void;
}

export default function MysteryOverlay({
  visible,
  mystery,
  mysterySet,
  onContinue,
}: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(40);
    }
  }, [visible, fadeAnim, slideAnim]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Número y tipo */}
        <Text style={styles.setName}>
          {mysterySet.emoji} {mysterySet.name}
        </Text>
        <Text style={styles.mysteryNumber}>
          {mystery.number}º Misterio
        </Text>

        {/* Título */}
        <Text style={styles.title}>{mystery.title}</Text>

        {/* Separador dorado */}
        <View style={styles.divider} />

        {/* Meditación */}
        <Text style={styles.meditation}>{mystery.meditation}</Text>

        {/* Versículo y Fruto */}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={styles.metaLabel}>Pasaje</Text>
            <Text style={styles.metaValue}>{mystery.verse}</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaLabel}>Fruto</Text>
            <Text style={styles.metaValue}>{mystery.fruit}</Text>
          </View>
        </View>

        {/* Botón */}
        <TouchableOpacity style={styles.btn} onPress={onContinue} activeOpacity={0.8}>
          <Text style={styles.btnText}>Comenzar el decenio</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  setName: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.sm,
    color: COLORS.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  mysteryNumber: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.md,
    color: COLORS.gold,
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.xxl,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 20,
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: COLORS.gold,
    borderRadius: 1,
    marginBottom: 20,
    opacity: 0.7,
  },
  meditation: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.md,
    color: COLORS.pearl,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    opacity: 0.9,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 36,
  },
  metaChip: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  metaLabel: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xs,
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  metaValue: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.sm,
    color: COLORS.pearl,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    paddingHorizontal: 44,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.md,
    color: '#1a0a00',
    letterSpacing: 0.5,
  },
});
