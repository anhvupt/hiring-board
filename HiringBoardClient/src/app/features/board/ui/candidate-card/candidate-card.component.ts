import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { ComponentStore, provideComponentStore } from '@ngrx/component-store';
import {
  TuiDataListModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiSvgModule
} from '@taiga-ui/core';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { CandidateBoardView, Stage } from '~/data-access/app.model';
import { AppService } from '~/data-access/app.service';
import { BoardStore } from '../../board.store';

@Component({
  selector: 'app-candidate-card',
  standalone: true,
  imports: [
    RouterLink,
    TuiBadgeModule,
    DatePipe,
    TuiSvgModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    PushPipe,
    CommonModule,
    TuiHintModule
  ],
  templateUrl: './candidate-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: 'tui-badge { @apply bg-accent text-primary; }',
  providers: [provideComponentStore(ComponentStore)]
})
export class CandidateCardComponent {
  @Input({ required: true }) candidate!: CandidateBoardView;
  @Input() connectedList: Stage[] = [];

  private readonly appService = inject(AppService);
  private readonly boardStore = inject(BoardStore);
  open = false;

  moveTo(id: number) {
    this.appService.updateCandidateStage([this.candidate.id], id).subscribe({
      next: () => this.boardStore.loadBoard({}),
      error: (e) => alert(e)
    });
  }
}
