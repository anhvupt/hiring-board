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
  providers: []
})
export class BoardColumnComponent {
  private readonly store = inject(BoardStore);

  get selectedItemsCount() {
    return this.list.filter((item) => item.selected).length;
  }

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
    .select(({ selectableStage, selectedIds }) => {
      const isSelectable = selectableStage === this.column?.id;
      const isMultipleMoving = isSelectable && selectedIds.size > 1;
      return {
        isSelectable,
        isMultipleMoving,
        selectedIds
      };
    })
    .pipe(takeUntilDestroyed());

  toggleSelectable() {
    this.store.toggleSelectable(this.column.id);
  }

  getIsSelected(list: Set<number>, id: number) {
    return list.has(id);
  }

  toggleSelected(id: number) {
    this.store.toggleCandidateSelection(id);
  }

  dropped(event: CdkDragDrop<CandidateBoardView[]>) {
    this.itemsDropped.next(event);
    this.store.resetSelection();
  }
}
