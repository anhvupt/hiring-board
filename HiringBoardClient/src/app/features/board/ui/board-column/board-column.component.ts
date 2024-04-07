import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import { cloneDeep } from 'lodash';
import { CandidateBoardView, Stage } from '~/data-access/app.model';
import { BoardStore } from '../../board.store';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';
import { HeaderComponent } from '../header/header.component';
import { distinctUntilChanged, filter, map, tap } from 'rxjs';
import { skeletonCandidate } from '../../board.const';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiTextfieldControllerModule,
    TuiSvgModule,
    HeaderComponent,
    CandidateCardComponent,
    RouterLink,
    PushPipe,
    TuiButtonModule
  ],
  templateUrl: './board-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  styles: `.cdk-drag-preview {@apply opacity-90;}`
})
export class BoardColumnComponent {
  private readonly store = inject(BoardStore);

  get connectedIds() {
    return this.connectedList.map((x) => String(x.id));
  }

  @Input({ required: true }) column!: { id: number; name: string };
  @Input({ required: true }) list!: CandidateBoardView[];
  @Input({ required: true }) connectedList: Stage[] = [];

  @Output() itemsDropped = new EventEmitter<
    CdkDragDrop<CandidateBoardView[]>
  >();

  vm$ = this.store
    .select(this.store.state$, this.store.isLoading$, (state, isLoading) => ({
      ...state,
      isSelectable: state.selectableStage === this.column?.id,
      isLoading
    }))
    .pipe(takeUntilDestroyed());

  readonly skeletonItems = new Array(4).map((x) => skeletonCandidate);

  toggleSelectable() {
    this.store.toggleSelectable(this.column.id);
  }

  isItemOnDragging(id: number) {
    return this.vm$.pipe(
      map(
        ({ isDragging, selectedIds }) =>
          isDragging && selectedIds.size > 1 && selectedIds.has(id)
      ),
      distinctUntilChanged()
    );
  }

  getIsSelected(list: Set<number>, id: number) {
    return list.has(id);
  }

  toggleSelected(id: number) {
    this.store.toggleCandidateSelection(id);
  }

  dragStarted() {
    this.store.patchState({ isDragging: true });
  }

  dropped(event: CdkDragDrop<CandidateBoardView[]>) {
    this.itemsDropped.next(event);
    this.store.resetDnDStates();
  }
}
