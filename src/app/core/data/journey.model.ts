export interface JourneyStage {
  id: string;
  name: string;
  description: string;
  /** Texto corto de "logro" que se muestra al alcanzar la etapa (gamificación). */
  achievement: string;
  /** Nombre de un icono de ionicons (sin sufijo), para el mapa visual del recorrido. */
  icon: string;
  /** Km acumulados desde el inicio del recorrido en los que arranca esta etapa. */
  distanceFromStartKm: number;
}

export interface JourneyConfig {
  id: string;
  title: string;
  /** Distancia total del recorrido completo, en km. */
  totalDistanceKm: number;
  stages: JourneyStage[];
}
