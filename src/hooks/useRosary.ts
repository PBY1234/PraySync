import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  buildRosarySequence,
  getTodayMysterySet,
  getMysterySetById,
  type MysterySet,
  type MysterySetId,
  type RosaryStep,
  PRAYERS,
} from '../constants/rosary';

const STORAGE_KEY = '@praysync_progress';

interface SavedProgress {
  mysterySetId: MysterySetId;
  stepIndex: number;
  savedAt: number;
}

export interface RosaryState {
  mysterySet: MysterySet;
  steps: RosaryStep[];
  currentIndex: number;
  currentStep: RosaryStep;
  prayerTitle: string;
  prayerText: string;
  // Progreso visual
  totalSteps: number;
  progress: number;          // 0–1
  decadeIndex: number;       // 0–4 (−1 = intro/cierre)
  beadInDecade: number;      // 0–10 (cuántas AveMarias completadas en este decenio)
  decadeComplete: boolean;   // acaba de llegar al Gloria
  // Acciones
  advance: () => void;
  goBack: () => void;
  restart: () => void;
  hasSaved: boolean;
  resumeSaved: () => void;
}

function getPrayerContent(
  step: RosaryStep,
  mysterySet: MysterySet,
): { title: string; text: string } {
  if (step.type === 'mystery_announce') {
    const mystery = mysterySet.mysteries[(step.decade ?? 1) - 1];
    return {
      title: `${step.decade}º Misterio ${mysterySet.name}`,
      text: `${mystery.title}\n\n${mystery.meditation}\n\n${mystery.verse}\n\nFruto: ${mystery.fruit}`,
    };
  }
  if (step.type === 'sign_of_cross_final') return PRAYERS['sign_of_cross'];
  return PRAYERS[step.type] ?? { title: step.type, text: '' };
}

export function useRosary(initialMysterySetId?: MysterySetId): RosaryState {
  const mysterySet = initialMysterySetId
    ? getMysterySetById(initialMysterySetId)
    : getTodayMysterySet();

  const steps = buildRosarySequence();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSaved, setHasSaved] = useState(false);
  const savedMysterySetId = useRef<MysterySetId>(mysterySet.id);

  // Cargar progreso guardado al montar
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const saved: SavedProgress = JSON.parse(raw);
        // Solo mostrar si es del mismo día (menos de 6h)
        if (Date.now() - saved.savedAt < 6 * 3600 * 1000) {
          setHasSaved(true);
          savedMysterySetId.current = saved.mysterySetId;
        }
      } catch {}
    });
  }, []);

  // Guardar progreso al avanzar
  const saveProgress = useCallback(
    (index: number) => {
      const payload: SavedProgress = {
        mysterySetId: mysterySet.id,
        stepIndex: index,
        savedAt: Date.now(),
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    },
    [mysterySet.id],
  );

  const advance = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = Math.min(prev + 1, steps.length - 1);
      saveProgress(next);
      return next;
    });
  }, [steps.length, saveProgress]);

  const goBack = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    AsyncStorage.removeItem(STORAGE_KEY);
    setHasSaved(false);
  }, []);

  const resumeSaved = useCallback(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const saved: SavedProgress = JSON.parse(raw);
        setCurrentIndex(saved.stepIndex);
        setHasSaved(false);
      } catch {}
    });
  }, []);

  const currentStep = steps[currentIndex];
  const { title: prayerTitle, text: prayerText } = getPrayerContent(
    currentStep,
    mysterySet,
  );

  // Decenio e índice de bead para la visualización
  const decadeIndex =
    currentStep.decade !== undefined ? currentStep.decade - 1 : -1;

  let beadInDecade = 0;
  if (
    currentStep.type === 'hail_mary' &&
    currentStep.decade !== undefined &&
    currentStep.beadInDecade !== undefined
  ) {
    beadInDecade = currentStep.beadInDecade - 1; // cuentas ya completadas
  } else if (currentStep.type === 'glory_be' && currentStep.decade !== undefined) {
    beadInDecade = 10;
  } else if (
    currentStep.type === 'fatima' &&
    currentStep.decade !== undefined
  ) {
    beadInDecade = 10;
  }

  const decadeComplete =
    currentStep.type === 'glory_be' && currentStep.isGloryBe === true;

  return {
    mysterySet,
    steps,
    currentIndex,
    currentStep,
    prayerTitle,
    prayerText,
    totalSteps: steps.length,
    progress: currentIndex / (steps.length - 1),
    decadeIndex,
    beadInDecade,
    decadeComplete,
    advance,
    goBack,
    restart,
    hasSaved,
    resumeSaved,
  };
}
