import { useState, useEffect } from 'react';

const COMMUNITY_MESSAGES = [
  'María de Buenos Aires acaba de terminar su rosario',
  'Un grupo de Lima reza junto ahora — 12 personas',
  'Ana de Madrid se acaba de unir',
  'Familia Rodríguez de Ciudad de México rezando',
  'Comunidad de religiosas en Roma — 40 personas',
  'Pedro de Bogotá lleva 30 días seguidos',
  'Grupo parroquial de Manila — 85 personas',
  'Carmela de Sevilla reza por sus nietos',
  'Comunidad de Medjugorje en oración — 200 personas',
  'Javier de Santiago lleva su primer rosario completo',
];

function getBasePrayerCount(): number {
  const now = new Date();
  const hour = now.getHours();
  const dow = now.getDay();

  // Base global de personas rezando (estimado fiel conservador)
  let base = 48000;

  // Multiplicador día (domingo y sábado más concurridos)
  const dayMult = [1.5, 0.9, 0.9, 1.0, 0.9, 1.1, 1.4][dow];

  // Multiplicador hora
  let hourMult = 0.25;
  if (hour >= 6 && hour < 9)   hourMult = 1.0;  // Laudes / rosario de mañana
  if (hour >= 9 && hour < 11)  hourMult = 0.6;
  if (hour >= 11 && hour < 13) hourMult = 0.85; // Ángelus del mediodía
  if (hour >= 13 && hour < 17) hourMult = 0.4;
  if (hour >= 17 && hour < 19) hourMult = 0.7;
  if (hour >= 19 && hour < 22) hourMult = 1.2;  // Rosario vespertino
  if (hour >= 22 || hour < 1)  hourMult = 0.45;

  const noise = (Math.random() - 0.5) * 6000;
  return Math.round(base * dayMult * hourMult + noise);
}

export function useLiveCount() {
  const [count, setCount] = useState(getBasePrayerCount);
  const [message, setMessage] = useState(COMMUNITY_MESSAGES[0]);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    // Actualizar contador cada 15 segundos
    const countTimer = setInterval(() => {
      setCount(getBasePrayerCount());
    }, 15_000);

    // Rotar mensajes de comunidad cada 8 segundos
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => {
        const next = (i + 1) % COMMUNITY_MESSAGES.length;
        setMessage(COMMUNITY_MESSAGES[next]);
        return next;
      });
    }, 8_000);

    return () => {
      clearInterval(countTimer);
      clearInterval(msgTimer);
    };
  }, []);

  return { count, message };
}

export function formatCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1).replace('.0', '')}K`;
  }
  return n.toLocaleString('es-ES');
}
