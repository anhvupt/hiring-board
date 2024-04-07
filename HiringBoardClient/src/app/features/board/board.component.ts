import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import {
  TuiDataListModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import { concatMap, distinctUntilChanged, take, tap } from 'rxjs';
import { Candidate, CandidateBoardView, Stage } from '~/data-access/app.model';
import { AppService } from '~/data-access/app.service';
import { interviewerFeature } from '~/store/features/interviewer.feature';
import { stageFeature } from '~/store/features/stages.feature';
import { BoardStore } from './board.store';
import { BoardColumnComponent } from './ui/board-column/board-column.component';
import { HeaderComponent } from './ui/header/header.component';
import { skeletonStage } from './board.const';

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
    PushPipe,
    LetDirective
  ],
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(BoardStore)]
})
export class BoardComponent {
  private readonly cStore = inject(BoardStore);
  private readonly store = inject(Store);
  private readonly appService = inject(AppService);

  readonly vm$ = this.cStore
    .select(
      this.cStore.state$,
      this.store.select(interviewerFeature.selectData),
      this.store.select(stageFeature.selectData),
      this.cStore.isLoading$,
      (state, interviewers, stages, isLoading) => ({
        ...state,
        interviewers,
        stages,
        isLoading
      })
    )
    .pipe(tap((x) => console.log('vm:', x)));

  readonly skeletonStages = new Array(4).map(() => skeletonStage);

  getConnectedList(stages: Stage[], id: number) {
    return stages.filter((x) => x.id !== id);
  }

  dropped(event: CdkDragDrop<CandidateBoardView[]>) {
    if (event.previousContainer === event.container) {
      return;
    }
    const prevStage = +event.previousContainer.id;
    const curStage = +event.container.id;

    this.cStore
      .select(({ candidates, selectedIds }) => {
        const items = selectedIds.size
          ? candidates[prevStage].filter((x) => selectedIds.has(x.id))
          : [candidates[prevStage][event.previousIndex]]; // the default dropped item
        return {
          items,
          selectedIds: selectedIds.size ? selectedIds : new Set([items[0].id])
        };
      })
      .pipe(
        take(1),
        tap(({ items, selectedIds }) =>
          this.cStore.patchState((state) => {
            let previous = [...state.candidates[prevStage]];
            const container = [...state.candidates[curStage]];

            previous = previous.filter((x) => !selectedIds.has(x.id));
            container.splice(event.currentIndex, 0, ...items);

            return {
              candidates: {
                ...state.candidates,
                [`${prevStage}`]: previous,
                [`${curStage}`]: container
              }
            };
          })
        ),
        concatMap(({ selectedIds }) =>
          this.appService.updateCandidateStage(
            Array.from(selectedIds.values()),
            +curStage
          )
        )
      )
      .subscribe({
        next: () => {},
        error: (e) => {
          alert(e);
          console.error(e);
        }
      });
  }
}
