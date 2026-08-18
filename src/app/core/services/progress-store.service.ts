import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'sendero-epico-progress-v1';

export interface DailyLogEntry {
  /** Fecha en formato YYYY-MM-DD (zona horaria local del dispositivo). */
  date: string;
  km: number;
}

export interface ProgressState {
  dailyLog: DailyLogEntry[];
  totalKm: number;
}

const EMPTY_STATE: ProgressState = { dailyLog: [], totalKm: 0 };

/**
 * Guarda el progreso del viaje en el dispositivo (sin cuenta ni servidor).
 *
 * Importante: `recordToday` guarda el valor TOTAL del día (no un incremento).
 * Así, sincronizar varias veces el mismo día no duplica km — simplemente se
 * sustituye la entrada de hoy y se recalcula el total.
 */
@Injectable({ providedIn: 'root' })
export class ProgressStoreService {
  private cache: ProgressState | null = null;

  async load(): Promise<ProgressState> {
    if (this.cache) {
      return this.cache;
    }
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    this.cache = value ? (JSON.parse(value) as ProgressState) : { ...EMPTY_STATE };
    return this.cache;
  }

  async recordToday(kmToday: number): Promise<ProgressState> {
    const state = await this.load();
    const today = this.todayKey();
    const existingIndex = state.dailyLog.findIndex((entry) => entry.date === today);

    if (existingIndex >= 0) {
      state.dailyLog[existingIndex] = { date: today, km: kmToday };
    } else {
      state.dailyLog.push({ date: today, km: kmToday });
    }

    state.dailyLog.sort((a, b) => a.date.localeCompare(b.date));
    state.totalKm = state.dailyLog.reduce((sum, entry) => sum + entry.km, 0);

    await this.persist(state);
    return state;
  }

  async reset(): Promise<void> {
    this.cache = { ...EMPTY_STATE, dailyLog: [] };
    await this.persist(this.cache);
  }

  private async persist(state: ProgressState): Promise<void> {
    this.cache = state;
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(state) });
  }

  private todayKey(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
