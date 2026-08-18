import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IonContent, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { ProgressStoreService, DailyLogEntry } from '../../core/services/progress-store.service';
import { StreakService } from '../../core/services/streak.service';
import { JourneyProgressService } from '../../core/services/journey-progress.service';
import { JourneyStage } from '../../core/data/journey.model';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, TranslatePipe, IonContent, IonCard, IonCardContent, IonIcon, AppHeaderComponent],
  providers: [DecimalPipe],
  templateUrl: './stats.page.html',
  styleUrl: './stats.page.scss',
})
export class StatsPage implements OnInit {
  totalKm = 0;
  totalDistanceKm = 0;
  kmRemaining = 0;
  activeDays = 0;
  currentStreak = 0;
  longestStreak = 0;
  averageKmPerActiveDay = 0;
  stagesCompleted = 0;
  stagesTotal = 0;
  nextStage: JourneyStage | null = null;
  kmToNextStage = 0;
  recentAchievements: JourneyStage[] = [];
  dailyLog: DailyLogEntry[] = [];

  constructor(
    private progressStore: ProgressStoreService,
    private streak: StreakService,
    private journeyProgress: JourneyProgressService,
    private decimalPipe: DecimalPipe
  ) {}

  async ngOnInit() {
    const state = await this.progressStore.load();
    this.dailyLog = [...state.dailyLog].sort((a, b) => b.date.localeCompare(a.date));
    this.totalKm = state.totalKm;
    this.activeDays = this.streak.totalActiveDays(state.dailyLog);
    this.currentStreak = this.streak.currentStreak(state.dailyLog);
    this.longestStreak = this.streak.longestStreak(state.dailyLog);
    this.averageKmPerActiveDay = this.activeDays > 0 ? this.totalKm / this.activeDays : 0;

    const progress = this.journeyProgress.computeProgress(state.totalKm);
    this.totalDistanceKm = progress.journey.totalDistanceKm;
    this.kmRemaining = Math.max(0, progress.journey.totalDistanceKm - progress.totalKm);
    this.stagesTotal = progress.journey.stages.length;
    this.stagesCompleted = progress.journey.stages.filter(
      (s) => s.distanceFromStartKm <= progress.totalKm
    ).length;
    this.nextStage = progress.nextStage;
    this.kmToNextStage = progress.kmToNextStage;

    this.recentAchievements = progress.journey.stages
      .filter((s) => s.distanceFromStartKm <= progress.totalKm)
      .sort((a, b) => b.distanceFromStartKm - a.distanceFromStartKm)
      .slice(0, 3);
  }

  /** Km redondeados con separador de miles, para usar dentro de params de traducción
   * (no se pueden encadenar pipes dentro de los params del pipe `translate`). */
  kmDisplay(km: number): string {
    return this.decimalPipe.transform(km, '1.0-0') ?? '';
  }

  /** Igual que `kmDisplay` pero con un decimal, para el km restante hasta la siguiente etapa. */
  kmDisplay1(km: number): string {
    return this.decimalPipe.transform(km, '1.1-1') ?? '';
  }
}
