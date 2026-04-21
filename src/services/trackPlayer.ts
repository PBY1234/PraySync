import TrackPlayer, { Capability, RepeatMode } from 'react-native-track-player';
import { type RosaryStep, type MysterySet, PRAYERS } from '../constants/rosary';

let isSetup = false;

export async function setupTrackPlayer(): Promise<void> {
  if (isSetup) return;
  try {
    await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });
    await TrackPlayer.updateOptions({
      capabilities: [Capability.SkipToNext, Capability.SkipToPrevious],
      compactCapabilities: [Capability.SkipToPrevious, Capability.SkipToNext],
      progressUpdateEventInterval: 0,
    });
    await TrackPlayer.add({
      id: 'silence',
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      url: require('../../assets/silence.wav'),
      title: 'PraySync',
      artist: 'Iniciando rosario…',
      album: 'PraySync',
    });
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
    await TrackPlayer.play();
    isSetup = true;
  } catch {
    // El player ya está configurado (reconexión)
    isSetup = true;
  }
}

export async function teardownTrackPlayer(): Promise<void> {
  try {
    await TrackPlayer.reset();
    isSetup = false;
  } catch {}
}

/** Actualiza el título e intérprete que se muestra en la pantalla bloqueada */
export async function updateLockScreen(
  title: string,
  artist: string,
): Promise<void> {
  try {
    const index = await TrackPlayer.getActiveTrackIndex();
    await TrackPlayer.updateMetadataForTrack(index ?? 0, {
      title,
      artist,
      album: 'PraySync · Rosario',
    });
  } catch {}
}

/** Genera las líneas de metadatos para cada paso del rosario */
export function getLockScreenLines(
  step: RosaryStep,
  mysterySet: MysterySet,
  currentIndex: number,
  totalSteps: number,
): { title: string; artist: string } {
  const stepNum = `${currentIndex + 1}/${totalSteps}`;

  if (step.type === 'hail_mary') {
    const beadLabel =
      step.decade !== undefined
        ? `Avemaría ${step.beadInDecade}/10`
        : `Avemaría ${step.beadInDecade}/3`;
    const mystery =
      step.decade !== undefined
        ? `${step.decade}° Misterio · ${mysterySet.mysteries[step.decade - 1].title}`
        : mysterySet.name;
    return { title: beadLabel, artist: mystery };
  }

  if (step.type === 'glory_be') {
    const nextDecade = (step.decade ?? 0) + 1;
    if (nextDecade <= 5) {
      const nextMystery = mysterySet.mysteries[nextDecade - 1];
      return {
        title: `Gloria — ${step.decade ?? ''}° decenio completado ✓`,
        artist: `Próximo: ${nextDecade}° · ${nextMystery.title}`,
      };
    }
    return { title: 'Gloria — último decenio ✓', artist: mysterySet.name };
  }

  if (step.type === 'mystery_announce' && step.decade !== undefined) {
    const m = mysterySet.mysteries[step.decade - 1];
    return {
      title: `${step.decade}° Misterio ${mysterySet.name}`,
      artist: m.title,
    };
  }

  if (step.type === 'our_father') {
    const context =
      step.decade !== undefined
        ? `${step.decade}° Misterio · ${mysterySet.mysteries[step.decade - 1].title}`
        : 'Inicio del rosario';
    return { title: 'Padre Nuestro', artist: context };
  }

  const label = PRAYERS[step.type]?.title ?? step.type;
  return { title: label, artist: `${mysterySet.emoji} ${mysterySet.name} · ${stepNum}` };
}
