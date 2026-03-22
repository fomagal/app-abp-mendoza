export type MendozaABPHeaderKey =
  | 'Escuela'
  | 'Ciclo 2026'
  | 'Docente'
  | 'Grado'
  | 'Turno';

export const MENDOZA_ABP_2026_HEADER: MendozaABPHeaderKey[] = [
  'Escuela',
  'Ciclo 2026',
  'Docente',
  'Grado',
  'Turno',
];

export const MENDOZA_ABP_2026_MANDATORY_POINTS = {
  situacionProblemaPregunta: 'Situación problema formulada como pregunta guía desafiante',
  productoPublico: 'Producto público con impacto en la comunidad',
  fluidezLectora: 'Incluye dispositivo de Fluidez Lectora',
  matematicaCincoPuntoCero: 'Incluye Matemática 5.0 (Matific)',
  trayectorias: 'Estrategias para trayectorias escolares continuas y completas',
  usoPlataformas: 'Uso de plataformas digitales (Matific / otras definidas por DGE)',
  vozEstudiantil: 'Voz, elección y protagonismo del estudiantado',
  vinculoTerritorial: 'Vinculación con organismos y actores locales',
  evaluacionCapacidades: 'Evaluación mediante rúbricas de capacidades',
  articulacionCensos: 'Articulación con censos y dispositivos de evaluación jurisdiccionales',
} as const;

export type MendozaABP2026MandatoryPointKey =
  keyof typeof MENDOZA_ABP_2026_MANDATORY_POINTS;

export interface MendozaABPProyectoState {
  headers: Partial<Record<MendozaABPHeaderKey, string>>;
  mandatoryPoints: Record<MendozaABP2026MandatoryPointKey, boolean>;
}

export interface MendozaABPValidacionResultado {
  valido: boolean;
  puntaje: number;
  observaciones: string[];
  motivosInvalidacionClaves: string[];
}

export const TABLA_CONTENIDOS_MENDOZA_ABP_2026: string[] = [
  'Escuela',
  'Ciclo 2026',
  'Docente',
  'Grado',
  'Turno',
  'Situación problema (en formato de pregunta)',
  'Producto público',
  'Fluidez Lectora',
  'Matemática 5.0 (Matific)',
  'Trayectorias y acompañamiento',
  'Uso de plataformas / recursos digitales',
  'Voz y elección del estudiante',
  'Articulación con el territorio',
  'Evaluación por capacidades y rúbricas',
  'Articulación con censos y evaluaciones jurisdiccionales',
];

export function validarMendozaABP2026(
  proyecto: MendozaABPProyectoState,
): MendozaABPValidacionResultado {
  const observaciones: string[] = [];
  const motivosInvalidacionClaves: string[] = [];

  let cumplidos = 0;
  const totalPuntos = Object.keys(
    MENDOZA_ABP_2026_MANDATORY_POINTS,
  ).length as number;

  (Object.keys(MENDOZA_ABP_2026_MANDATORY_POINTS) as MendozaABP2026MandatoryPointKey[]).forEach(
    (clave) => {
      const aplicado = proyecto.mandatoryPoints[clave];
      if (aplicado) {
        cumplidos++;
      } else {
        observaciones.push(
          `Falta cumplir con: ${
            MENDOZA_ABP_2026_MANDATORY_POINTS[clave]
          }`,
        );
      }
    },
  );

  const tieneFluidez = proyecto.mandatoryPoints.fluidezLectora;
  const tieneMatematica = proyecto.mandatoryPoints.matematicaCincoPuntoCero;

  if (!tieneFluidez) {
    motivosInvalidacionClaves.push(
      'El proyecto no incorpora Fluidez Lectora (requisito obligatorio DGE).',
    );
  }

  if (!tieneMatematica) {
    motivosInvalidacionClaves.push(
      'El proyecto no incorpora Matemática 5.0 (Matific) (requisito obligatorio DGE).',
    );
  }

  const puntaje =
    totalPuntos === 0 ? 0 : Math.round((cumplidos / totalPuntos) * 100);

  const valido =
    motivosInvalidacionClaves.length === 0 && cumplidos === totalPuntos;

  return {
    valido,
    puntaje,
    observaciones,
    motivosInvalidacionClaves,
  };
}

