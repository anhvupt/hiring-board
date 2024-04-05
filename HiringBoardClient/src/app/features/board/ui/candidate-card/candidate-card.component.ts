import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
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
import { TuiBadgeModule, TuiCheckboxModule } from '@taiga-ui/kit';
import { CandidateBoardView, Stage } from '~/data-access/app.model';
import { AppService } from '~/data-access/app.service';
import { BoardStore } from '../../board.store';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

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
    TuiHintModule,
    TuiCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './candidate-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: 'tui-badge { @apply bg-accent text-primary; }',
  providers: [provideComponentStore(ComponentStore)]
})
export class CandidateCardComponent {
  private readonly appService = inject(AppService);
  private readonly boardStore = inject(BoardStore);

  open = false;
  _isSelected = false;

  @Input({ required: true }) candidate!: CandidateBoardView;
  @Input() connectedList: Stage[] = [];
  @Input() isSelectable = false;
  @Input() set isSelected(value: boolean) {
    this._isSelected = value;
  }

  @Output() checkChanges = new EventEmitter<unknown>();

  get isSelected() {
    return this._isSelected;
  }

  moveTo(id: number) {
    this.appService.updateCandidateStage([this.candidate.id], id).subscribe({
      next: () => this.boardStore.reloadBoard(),
      error: (e) => alert(e)
    });
  }

  toggleChecked() {
    this.checkChanges.next(Date.now);
  }
}
