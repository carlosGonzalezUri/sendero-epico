import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Health } from 'capacitor-health';

/** Metros que recorre de media una persona por paso, para pasar de pasos a km. */
const AVERAGE_STRIDE_METERS = 0.78;

export interface StepsAvailability {
  available: boolean;
  reason?: 'not-native' | 'health-connect-not-installed' | 'permission-denied';
}

@Injectable({ providedIn: 'root' })
export class StepsService {
  private permissionsGranted = false;

  /**
   * Comprueba si podemos leer datos de salud en este dispositivo.
   * En el navegador (ionic serve) no hay Health Connect, así que se informa
   * como no disponible en vez de lanzar un error — la UI puede decidir mostrar
   * datos de ejemplo o pedir al usuario que abra la app en su móvil.
   */
  async checkAvailability(): Promise<StepsAvailability> {
    if (!Capacitor.isNativePlatform()) {
      return { available: false, reason: 'not-native' };
    }
    const { available } = await Health.isHealthAvailable();
    if (!available) {
      return { available: false, reason: 'health-connect-not-installed' };
    }
    return { available: true };
  }

  async requestPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }
    const response = await Health.requestHealthPermissions({
      permissions: ['READ_STEPS', 'READ_DISTANCE'],
    });
    this.permissionsGranted = response.permissions.some((p) => p['READ_STEPS']);
    return this.permissionsGranted;
  }

  /** Distancia recorrida hoy, en km, a partir de los pasos registrados en Health Connect. */
  async getTodayDistanceKm(): Promise<number> {
    if (!Capacitor.isNativePlatform()) {
      // Modo desarrollo en navegador: valor de ejemplo para poder ver la UI sin un móvil.
      return this.mockTodayDistanceKm();
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const now = new Date();

    const { aggregatedData } = await Health.queryAggregated({
      startDate: startOfDay.toISOString(),
      endDate: now.toISOString(),
      dataType: 'steps',
      bucket: '1d',
    });

    const totalSteps = aggregatedData.reduce((sum, sample) => sum + sample.value, 0);
    return this.stepsToKm(totalSteps);
  }

  private stepsToKm(steps: number): number {
    return (steps * AVERAGE_STRIDE_METERS) / 1000;
  }

  private mockTodayDistanceKm(): number {
    // Entre 2 y 7 km, solo para previsualizar la UI en el navegador durante el desarrollo.
    return Math.round((2 + Math.random() * 5) * 10) / 10;
  }
}
