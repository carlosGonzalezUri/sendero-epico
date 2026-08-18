import { Injectable } from '@angular/core';
import { DEFAULT_JOURNEY } from '../data/journey.data';
import { JourneyConfig, JourneyStage } from '../data/journey.model';

export interface JourneyProgress {
  journey: JourneyConfig;
  totalKm: number;
  /** Etapa en la que se encuentra el usuario ahora mismo. */
  currentStage: JourneyStage;
  /** Etapa siguiente, o null si ya se completó el recorrido. */
  nextStage: JourneyStage | null;
  /** Km que faltan para la siguiente etapa (0 si ya se ha completado todo). */
  kmToNextStage: number;
  /** Progreso global del recorrido, de 0 a 100. */
  percentComplete: number;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class JourneyProgressService {
  private readonly journey: JourneyConfig = DEFAULT_JOURNEY;

  getJourney(): JourneyConfig {
    return this.journey;
  }

  computeProgress(totalKm: number): JourneyProgress {
    const cappedKm = Math.min(totalKm, this.journey.totalDistanceKm);
    const stages = this.journey.stages;

    let currentStage = stages[0];
    let nextStage: JourneyStage | null = stages.length > 1 ? stages[1] : null;

    for (let i = 0; i < stages.length; i++) {
      if (cappedKm >= stages[i].distanceFromStartKm) {
        currentStage = stages[i];
        nextStage = i + 1 < stages.length ? stages[i + 1] : null;
      }
    }

    const kmToNextStage = nextStage ? Math.max(0, nextStage.distanceFromStartKm - cappedKm) : 0;
    const percentComplete = (cappedKm / this.journey.totalDistanceKm) * 100;

    return {
      journey: this.journey,
      totalKm: cappedKm,
      currentStage,
      nextStage,
      kmToNextStage,
      percentComplete,
      completed: cappedKm >= this.journey.totalDistanceKm,
    };
  }
}
