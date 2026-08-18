import { Injectable } from '@angular/core';
import { DailyLogEntry } from './progress-store.service';

/** Km mínimos en un día para que cuente como "día activo" en la racha. */
const MIN_KM_FOR_ACTIVE_DAY = 0.3;

@Injectable({ providedIn: 'root' })
export class StreakService {
  /** Racha actual de días consecutivos activos, terminando hoy o ayer (si hoy aún no hay datos). */
  currentStreak(dailyLog: DailyLogEntry[]): number {
    if (dailyLog.length === 0) {
      return 0;
    }

    const activeDates = new Set(
      dailyLog.filter((e) => e.km >= MIN_KM_FOR_ACTIVE_DAY).map((e) => e.date)
    );

    let streak = 0;
    const cursor = new Date();
    // Si hoy todavía no hay actividad registrada, la racha se cuenta desde ayer
    // (para no romperla solo porque el usuario aún no ha sincronizado hoy).
    if (!activeDates.has(this.toKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (activeDates.has(this.toKey(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  totalActiveDays(dailyLog: DailyLogEntry[]): number {
    return dailyLog.filter((e) => e.km >= MIN_KM_FOR_ACTIVE_DAY).length;
  }

  /** La racha más larga conseguida nunca (no solo la que sigue activa ahora). */
  longestStreak(dailyLog: DailyLogEntry[]): number {
    const activeDates = dailyLog
      .filter((e) => e.km >= MIN_KM_FOR_ACTIVE_DAY)
      .map((e) => e.date)
      .sort();

    if (activeDates.length === 0) {
      return 0;
    }

    let longest = 1;
    let current = 1;

    for (let i = 1; i < activeDates.length; i++) {
      const prev = new Date(activeDates[i - 1]);
      const curr = new Date(activeDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

      current = diffDays === 1 ? current + 1 : 1;
      longest = Math.max(longest, current);
    }

    return longest;
  }

  private toKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
