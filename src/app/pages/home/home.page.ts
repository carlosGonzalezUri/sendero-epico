import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {
  IonContent,
  IonProgressBar,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { SyncService, SyncResult } from '../../core/services/sync.service';
import { ProgressStoreService } from '../../core/services/progress-store.service';
import { JourneyProgressService, JourneyProgress } from '../../core/services/journey-progress.service';
import { JourneyStage } from '../../core/data/journey.model';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    IonContent,
    IonProgressBar,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    AppHeaderComponent,
  ],
  providers: [DecimalPipe],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  progress: JourneyProgress | null = null;
  syncMessage = '';
  loading = true;

  constructor(
    private sync: SyncService,
    private progressStore: ProgressStoreService,
    private journeyProgress: JourneyProgressService,
    private decimalPipe: DecimalPipe
  ) {}

  /** Km redondeados con separador de miles, para usar dentro de params de traducción
   * (no se pueden encadenar pipes dentro de los params del pipe `translate`). */
  kmDisplay(km: number): string {
    return this.decimalPipe.transform(km, '1.0-0') ?? '';
  }

  async ngOnInit() {
    const state = await this.progressStore.load();
    this.progress = this.journeyProgress.computeProgress(state.totalKm);
    this.loading = false;
    await this.doSync();
  }

  async doSync(refresherEvent?: CustomEvent) {
    const result: SyncResult = await this.sync.syncToday();
    this.applySyncResult(result);
    (refresherEvent?.target as unknown as { complete: () => void } | undefined)?.complete();
  }

  stageStatus(stage: JourneyStage): 'done' | 'current' | 'upcoming' {
    if (!this.progress) return 'upcoming';
    if (stage.id === this.progress.currentStage.id) return 'current';
    return stage.distanceFromStartKm < this.progress.currentStage.distanceFromStartKm ? 'done' : 'upcoming';
  }

  private applySyncResult(result: SyncResult) {
    switch (result.status) {
      case 'ok':
        this.progress = this.journeyProgress.computeProgress(result.state.totalKm);
        this.syncMessage = '';
        break;
      case 'needs-permission':
        this.syncMessage = 'home.syncNeedsPermission';
        break;
      case 'health-connect-not-installed':
        this.syncMessage = 'home.syncNeedsHealthConnect';
        break;
      case 'not-native':
        this.syncMessage = '';
        break;
    }
  }
}
