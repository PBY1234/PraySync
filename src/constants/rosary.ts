// ─── Tipos ────────────────────────────────────────────────────────────────────

export type MysterySetId = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';

export interface Mystery {
  number: number;
  title: string;
  meditation: string;
  verse: string;
  fruit: string;
}

export interface MysterySet {
  id: MysterySetId;
  name: string;
  days: number[]; // 0=Dom…6=Sáb
  emoji: string;
  mysteries: Mystery[];
}

export type StepType =
  | 'sign_of_cross'
  | 'creed'
  | 'our_father'
  | 'hail_mary'
  | 'glory_be'
  | 'fatima'
  | 'mystery_announce'
  | 'salve'
  | 'closing'
  | 'sign_of_cross_final';

export interface RosaryStep {
  type: StepType;
  decade?: number;       // 1–5
  beadInDecade?: number; // 1–10 para Ave; 1–3 para las intro
  isGloryBe?: boolean;
}

// ─── Misterios ────────────────────────────────────────────────────────────────

export const MYSTERY_SETS: Record<MysterySetId, MysterySet> = {
  joyful: {
    id: 'joyful',
    name: 'Misterios Gozosos',
    days: [1, 6],
    emoji: '✨',
    mysteries: [
      {
        number: 1,
        title: 'La Anunciación del Ángel Gabriel a María',
        meditation: 'El ángel Gabriel anuncia a la Virgen María que será la Madre del Hijo de Dios.',
        verse: 'Lc 1,26-38',
        fruit: 'Humildad',
      },
      {
        number: 2,
        title: 'La Visitación de María a Santa Isabel',
        meditation: 'María, llevando a Jesús en su seno, visita a su prima Isabel y la llena de alegría.',
        verse: 'Lc 1,39-56',
        fruit: 'Amor al prójimo',
      },
      {
        number: 3,
        title: 'El Nacimiento de Jesús en Belén',
        meditation: 'Jesús, el Hijo de Dios, nace pobre en un establo de Belén rodeado de pastores.',
        verse: 'Lc 2,1-21',
        fruit: 'Pobreza y desapego del mundo',
      },
      {
        number: 4,
        title: 'La Presentación de Jesús en el Templo',
        meditation: 'María y José presentan al niño Jesús en el Templo de Jerusalén cumpliendo la Ley.',
        verse: 'Lc 2,22-40',
        fruit: 'Obediencia y pureza',
      },
      {
        number: 5,
        title: 'El Niño Jesús, perdido y hallado en el Templo',
        meditation: 'Tras tres días de búsqueda angustiosa, María y José encuentran a Jesús entre los doctores.',
        verse: 'Lc 2,41-52',
        fruit: 'Alegría de encontrar a Jesús',
      },
    ],
  },

  luminous: {
    id: 'luminous',
    name: 'Misterios Luminosos',
    days: [4],
    emoji: '🕊️',
    mysteries: [
      {
        number: 1,
        title: 'El Bautismo de Jesús en el Jordán',
        meditation: 'Al ser bautizado, el Padre proclama: "Este es mi Hijo amado" y el Espíritu desciende sobre Jesús.',
        verse: 'Mt 3,13-17',
        fruit: 'Apertura al Espíritu Santo',
      },
      {
        number: 2,
        title: 'Las Bodas de Caná',
        meditation: 'Por intercesión de María, Jesús realiza su primer milagro convirtiendo el agua en vino.',
        verse: 'Jn 2,1-12',
        fruit: 'Fidelidad y confianza en María',
      },
      {
        number: 3,
        title: 'El Anuncio del Reino de Dios',
        meditation: 'Jesús proclama el Reino de Dios y llama a la conversión y a creer en el Evangelio.',
        verse: 'Mc 1,15',
        fruit: 'Conversión y penitencia',
      },
      {
        number: 4,
        title: 'La Transfiguración',
        meditation: 'En el monte Tabor, Jesús se transfigura ante Pedro, Santiago y Juan, mostrando su gloria divina.',
        verse: 'Mt 17,1-8',
        fruit: 'Deseo de santidad',
      },
      {
        number: 5,
        title: 'La Institución de la Eucaristía',
        meditation: 'En la Última Cena, Jesús instituye la Eucaristía como su Cuerpo y Sangre entregados por nosotros.',
        verse: 'Mt 26,26-29',
        fruit: 'Adoración eucarística',
      },
    ],
  },

  sorrowful: {
    id: 'sorrowful',
    name: 'Misterios Dolorosos',
    days: [2, 5],
    emoji: '🌹',
    mysteries: [
      {
        number: 1,
        title: 'La Oración de Jesús en el Huerto de los Olivos',
        meditation: 'Jesús suda sangre en Getsemaní aceptando la voluntad del Padre por amor a nosotros.',
        verse: 'Lc 22,39-46',
        fruit: 'Contrición por los pecados',
      },
      {
        number: 2,
        title: 'La Flagelación de Jesús',
        meditation: 'Jesús, atado a la columna, es azotado cruelmente por los soldados romanos.',
        verse: 'Jn 19,1',
        fruit: 'Mortificación de los sentidos',
      },
      {
        number: 3,
        title: 'La Coronación de Espinas',
        meditation: 'Los soldados colocan una corona de espinas sobre la cabeza de Jesús y se burlan de Él.',
        verse: 'Mt 27,29',
        fruit: 'Valor moral y fortaleza',
      },
      {
        number: 4,
        title: 'Jesús con la Cruz a Cuestas camino del Calvario',
        meditation: 'Jesús carga la cruz hacia el Gólgota, agotado y golpeado, por amor a cada uno de nosotros.',
        verse: 'Jn 19,17',
        fruit: 'Paciencia en el sufrimiento',
      },
      {
        number: 5,
        title: 'La Crucifixión y Muerte de Jesús en la Cruz',
        meditation: 'Jesús muere en la cruz entre dos ladrones. "Todo está cumplido." Nos da a María como Madre.',
        verse: 'Jn 19,18-30',
        fruit: 'Salvación y perdón de los pecados',
      },
    ],
  },

  glorious: {
    id: 'glorious',
    name: 'Misterios Gloriosos',
    days: [0, 3],
    emoji: '👑',
    mysteries: [
      {
        number: 1,
        title: 'La Resurrección de Jesús',
        meditation: 'Al tercer día, Jesús resucita glorioso, venciendo la muerte y el pecado para siempre.',
        verse: 'Mc 16,1-7',
        fruit: 'Fe',
      },
      {
        number: 2,
        title: 'La Ascensión de Jesús al Cielo',
        meditation: 'Cuarenta días después de la Resurrección, Jesús sube al Cielo ante sus discípulos.',
        verse: 'Lc 24,50-53',
        fruit: 'Esperanza del cielo',
      },
      {
        number: 3,
        title: 'La Venida del Espíritu Santo sobre los Apóstoles',
        meditation: 'En Pentecostés, el Espíritu Santo desciende en lenguas de fuego sobre María y los Apóstoles.',
        verse: 'Hch 2,1-11',
        fruit: 'Sabiduría y amor de Dios',
      },
      {
        number: 4,
        title: 'La Asunción de María a los Cielos',
        meditation: 'Al fin de su vida terrenal, María es asunta en cuerpo y alma a la gloria celestial.',
        verse: 'Ap 12,1',
        fruit: 'Gracia de una buena muerte',
      },
      {
        number: 5,
        title: 'La Coronación de la Virgen como Reina del Universo',
        meditation: 'María es coronada Reina del Cielo y de la Tierra, intercesora y Madre de toda la humanidad.',
        verse: 'Ap 12,1',
        fruit: 'Confianza en la intercesión de María',
      },
    ],
  },
};

// ─── Oraciones ────────────────────────────────────────────────────────────────

export const PRAYERS: Record<string, { title: string; text: string }> = {
  sign_of_cross: {
    title: 'Señal de la Cruz',
    text: 'Por la señal de la Santa Cruz,\nde nuestros enemigos líbranos, Señor Dios nuestro.\n\nEn el nombre del Padre,\ny del Hijo,\ny del Espíritu Santo.\n\nAmén.',
  },
  creed: {
    title: 'Credo de los Apóstoles',
    text: 'Creo en Dios, Padre todopoderoso,\ncreador del cielo y de la tierra.\n\nCreo en Jesucristo, su único Hijo, Nuestro Señor,\nque fue concebido por obra y gracia del Espíritu Santo,\nnació de Santa María Virgen,\npadeció bajo el poder de Poncio Pilato,\nfue crucificado, muerto y sepultado,\ndescendió a los infiernos,\nal tercer día resucitó de entre los muertos,\nsubió a los cielos\ny está sentado a la derecha de Dios, Padre todopoderoso.\nDesde allí ha de venir a juzgar a vivos y muertos.\n\nCreo en el Espíritu Santo,\nla santa Iglesia católica,\nla comunión de los santos,\nel perdón de los pecados,\nla resurrección de la carne\ny la vida eterna.\n\nAmén.',
  },
  our_father: {
    title: 'Padre Nuestro',
    text: 'Padre nuestro, que estás en el cielo,\nsantificado sea tu Nombre;\nvenga a nosotros tu reino;\nhágase tu voluntad\nen la tierra como en el cielo.\n\nDanos hoy nuestro pan de cada día;\nperdona nuestras ofensas,\ncomo también nosotros perdonamos\na los que nos ofenden;\nno nos dejes caer en la tentación,\ny líbranos del mal.\n\nAmén.',
  },
  hail_mary: {
    title: 'Avemaría',
    text: 'Dios te salve, María,\nllena eres de gracia;\nel Señor es contigo;\nbendita tú eres entre todas las mujeres,\ny bendito es el fruto de tu vientre, Jesús.\n\nSanta María, Madre de Dios,\nruega por nosotros, pecadores,\nahora y en la hora de nuestra muerte.\n\nAmén.',
  },
  glory_be: {
    title: 'Gloria',
    text: 'Gloria al Padre,\ny al Hijo,\ny al Espíritu Santo;\n\ncomo era en el principio,\nahora y siempre,\npor los siglos de los siglos.\n\nAmén.',
  },
  fatima: {
    title: 'Jaculatoria de Fátima',
    text: 'Oh Jesús mío,\nperdona nuestros pecados,\nsálvanos del fuego del infierno,\nlleva al cielo a todas las almas,\nespecialmente a las más necesitadas\nde tu misericordia.\n\nAmén.',
  },
  salve: {
    title: 'Salve Regina',
    text: 'Dios te salve, Reina y Madre de misericordia,\nvida, dulzura y esperanza nuestra,\nDios te salve.\n\nA ti llamamos los desterrados hijos de Eva;\na ti suspiramos, gimiendo y llorando\nen este valle de lágrimas.\n\nEa, pues, Señora, abogada nuestra,\nvuelve a nosotros esos tus ojos misericordiosos;\ny después de este destierro,\nmuéstranos a Jesús,\nfruto bendito de tu vientre.\n\n¡Oh clementísima, oh piadosa,\noh dulce Virgen María!\n\nRuega por nosotros,\nSanta Madre de Dios,\npara que seamos dignos de alcanzar\nlas promesas de Jesucristo.\n\nAmén.',
  },
  closing: {
    title: 'Oración Final',
    text: 'Oh Dios, cuyo Hijo Unigénito,\npor su vida, muerte y resurrección,\nnos ha obtenido los premios de la salvación eterna,\nte pedimos que, meditando estos misterios\ndel Santísimo Rosario de la Virgen María,\nimitemos lo que contienen\ny alcancemos lo que prometen.\n\nPor el mismo Jesucristo Nuestro Señor.\n\nAmén.',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTodayMysterySet(): MysterySet {
  const dow = new Date().getDay(); // 0=Dom
  for (const set of Object.values(MYSTERY_SETS)) {
    if (set.days.includes(dow)) return set;
  }
  return MYSTERY_SETS.glorious;
}

export function getMysterySetById(id: MysterySetId): MysterySet {
  return MYSTERY_SETS[id];
}

/** Construye la secuencia completa de 80 pasos para el rosario */
export function buildRosarySequence(): RosaryStep[] {
  const steps: RosaryStep[] = [];

  // Introducción (7 pasos)
  steps.push({ type: 'sign_of_cross' });
  steps.push({ type: 'creed' });
  steps.push({ type: 'our_father' });
  steps.push({ type: 'hail_mary', beadInDecade: 1 });
  steps.push({ type: 'hail_mary', beadInDecade: 2 });
  steps.push({ type: 'hail_mary', beadInDecade: 3 });
  steps.push({ type: 'glory_be', isGloryBe: true });

  // 5 decenios (14 pasos cada uno = 70)
  for (let d = 1; d <= 5; d++) {
    steps.push({ type: 'mystery_announce', decade: d });
    steps.push({ type: 'our_father', decade: d });
    for (let b = 1; b <= 10; b++) {
      steps.push({ type: 'hail_mary', decade: d, beadInDecade: b });
    }
    steps.push({ type: 'glory_be', decade: d, isGloryBe: true });
    steps.push({ type: 'fatima', decade: d });
  }

  // Cierre (3 pasos)
  steps.push({ type: 'salve' });
  steps.push({ type: 'closing' });
  steps.push({ type: 'sign_of_cross_final' });

  return steps; // 80 pasos en total
}
