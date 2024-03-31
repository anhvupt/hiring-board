import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PushPipe } from '@ngrx/component';
import {
  ComponentStore,
  provideComponentStore,
  tapResponse
} from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import {
  TuiDataListModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import {
  catchError,
  map,
  of,
  pipe,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs';
import { Board, CandidateBoardView } from '~/data-access/app.model';
import { interviewerFeature } from '~/store/features/interviewer.feature';
import { stageFeature } from '~/store/features/stages.feature';
import { BoardColumnComponent } from './ui/board-column/board-column.component';
import { HeaderComponent } from './ui/header/header.component';
import { AppService } from '~/data-access/app.service';

const initialState = {
  candidates: {} as Board,
  isMultipleMoving: false
};

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiTextfieldControllerModule,
    TuiSvgModule,
    HeaderComponent,
    BoardColumnComponent,
    PushPipe
  ],
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(ComponentStore)]
})
export class BoardComponent {
  private readonly cStore =
    inject<ComponentStore<typeof initialState>>(ComponentStore);
  private readonly store = inject(Store);
  private readonly appService = inject(AppService);

  vm$ = this.cStore.select(
    this.cStore.state$,
    this.store.select(interviewerFeature.selectData),
    this.store.select(stageFeature.selectData),
    (state, interviewers, stages) => ({ ...state, interviewers, stages })
  );

  constructor() {
    this.cStore.setState(initialState);
    this.loadBoard(of({}));
  }

  getList(id: number) {
    return this.vm$.pipe(
      map(({ candidates }) =>
        id in candidates ? candidates[+id as keyof typeof candidates] : []
      )
    );
  }

  getConnectedIds(id: number) {
    return this.vm$.pipe(
      map(({ stages }) =>
        stages.filter((x) => x.id !== id).map((x) => String(x.id))
      )
    );
  }

  drop(event: CdkDragDrop<CandidateBoardView[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const previousContainerData = event.previousContainer.data;
      const containerData = event.container.data;
      const selectedItems = previousContainerData.filter(
        (item) => item.selected
      );

      if (selectedItems.length > 0) {
        // Move all selected items
        selectedItems.forEach((item) => {
          const index = previousContainerData.indexOf(item);
          if (index !== -1) {
            transferArrayItem(
              previousContainerData,
              containerData,
              index,
              event.currentIndex
            );
          }
        });
        // Deselect items after moving
      } else {
        console.log(
          previousContainerData,
          containerData,
          event.previousIndex,
          event.currentIndex
        );
        // Move single item logic if no items are selected
        transferArrayItem(
          previousContainerData,
          containerData,
          event.previousIndex,
          event.currentIndex
        );
      }
    }

    // this.isMultiMoving = false;
    // [Array.from(this.lists.values())].forEach((list) =>
    //   list.forEach((item) => (item.selected = false))
    // );
  }

  private loadBoard = this.cStore.effect<object>(
    pipe(
      switchMap(() => this.appService.getCandidates()),
      withLatestFrom(this.store.select(stageFeature.selectData)),
      tap(([candidates, stages]) => {
        const resolved = stages.reduce(
          (acc, cur) => ({ ...acc, [`${cur.id}`]: candidates[cur.id] ?? [] }),
          {}
        );
        this.cStore.patchState({ candidates: resolved });
      }),
      catchError((error) => {
        console.error(error);
        return of(error);
      })
    )
  );
}
