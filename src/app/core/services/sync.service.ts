import { Injectable } from '@angular/core';
import { StepsService } from './steps.service';
import { ProgressStoreService, ProgressState } from './progress-store.service';

export type SyncResult =
  | { status: 'ok'; state: ProgressState }
  | { status: 'needs-permission' }
  | { status: 'health-connect-not-installed' }
  | { status: 'not-native' };

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(
    private steps: StepsService,
    private progressStore: ProgressStoreService
  ) {}

  async syncToday(): Promise<SyncResult> {
    const availability = await this.steps.checkAvailability();

    if (!availability.available && availability.reason === 'health-connect-not-installed') {
      return { status: 'health-connect-not-installed' };
    }

    // En el navegador (desarrollo) seguimos adelante con datos de ejemplo.
    if (!availability.available && availability.reason === 'not-native') {
      const kmToday = await this.steps.getTodayDistanceKm();
      const state = await this.progressStore.recordToday(kmToday);
      return { status: 'ok', state };
    }

    const granted = await this.steps.requestPermissions();
    if (!granted) {
      return { status: 'needs-permission' };
    }

    const kmToday = await this.steps.getTodayDistanceKm();
    const state = await this.progressStore.recordToday(kmToday);
    return { status: 'ok', state };
  }
}
