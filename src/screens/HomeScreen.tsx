import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getTodayMysterySet } from '../constants/rosary';
import LiveCounter from '../components/LiveCounter';
import { COLORS, FONTS, SIZES, RADIUS } from '../theme';
import {
  registerForPushNotifications,
  scheduleDailyReminders,
  scheduleWeeklyPapalMessage,
} from '../services/notifications';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const DOW_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function HomeScreen({ navigation }: Props) {
  const todaySet = getTodayMysterySet();
  const today = new Date();
  const dowStr = DOW_ES[today.getDay()];

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      if (token) {
        scheduleDailyReminders();
        scheduleWeeklyPapalMessage();
      }
    });
  }, []);

  const gradientColors = COLORS.bg[todaySet.id] as [string, string];

  return (
    <LinearGradient colors={gradientColors} style={styles.flex}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>PraySync</Text>
            <Text style={styles.tagline}>Reza. Juntos.</Text>
          </View>

          {/* Live counter */}
          <LiveCounter />

          {/* Misterios de hoy */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>MISTERIOS DE HOY</Text>
              <Text style={styles.cardDay}>{dowStr}</Text>
            </View>
            <Text style={styles.mysterySetName}>
              {todaySet.emoji}  {todaySet.name}
            </Text>
            <View style={styles.mysteryList}>
              {todaySet.mysteries.map((m) => (
                <View key={m.number} style={styles.mysteryRow}>
                  <View style={styles.mysteryDot} />
                  <Text style={styles.mysteryItem} numberOfLines={1}>
                    {m.number}. {m.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA principal */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Pray', { mysterySetId: todaySet.id })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#e8c84a', '#c4991e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtnGrad}
            >
              <Text style={styles.primaryBtnText}>Comenzar el Rosario</Text>
              <Text style={styles.primaryBtnSub}>
                {todaySet.name} · {todaySet.mysteries.length} misterios
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>o elige otro</Text>
            <View style={styles.orLine} />
          </View>

          {/* Otros misterios */}
          <View style={styles.altGrid}>
            {([
              { id: 'joyful',    label: 'Gozosos',    emoji: '✨', days: 'Lun · Sáb' },
              { id: 'luminous',  label: 'Luminosos',  emoji: '🕊️', days: 'Jueves' },
              { id: 'sorrowful', label: 'Dolorosos',  emoji: '🌹', days: 'Mar · Vie' },
              { id: 'glorious',  label: 'Gloriosos',  emoji: '👑', days: 'Mié · Dom' },
            ] as const).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.altChip,
                  item.id === todaySet.id && styles.altChipActive,
                ]}
                onPress={() => navigation.navigate('Pray', { mysterySetId: item.id })}
                activeOpacity={0.75}
              >
                <Text style={styles.altEmoji}>{item.emoji}</Text>
                <Text style={styles.altLabel}>{item.label}</Text>
                <Text style={styles.altDays}>{item.days}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  logo: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.xxxl,
    color: COLORS.white,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.md,
    color: COLORS.muted,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  // Card misterios
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.xs,
    color: COLORS.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardDay: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.sm,
    color: COLORS.gold,
  },
  mysterySetName: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.xl,
    color: COLORS.white,
    marginBottom: 14,
  },
  mysteryList: { gap: 8 },
  mysteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mysteryDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.gold,
    opacity: 0.7,
  },
  mysteryItem: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.sm,
    color: COLORS.pearl,
    flex: 1,
  },
  // Botón principal
  primaryBtn: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryBtnGrad: {
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: RADIUS.xl,
  },
  primaryBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.lg,
    color: '#1a0a00',
    letterSpacing: 0.3,
  },
  primaryBtnSub: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xs,
    color: 'rgba(0,0,0,0.55)',
    marginTop: 3,
  },
  // OR separator
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.cardBorder,
  },
  orText: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xs,
    color: COLORS.faint,
    letterSpacing: 0.5,
  },
  // Grid de misterios alternativos
  altGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  altChip: {
    width: '47.5%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 4,
  },
  altChipActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldDim,
  },
  altEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  altLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.sm,
    color: COLORS.white,
  },
  altDays: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.xs,
    color: COLORS.muted,
  },
});
