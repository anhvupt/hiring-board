import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PushPipe } from '@ngrx/component';
import { provideComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import {
  TuiDataListModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import { distinctUntilChanged, take, tap } from 'rxjs';
import { CandidateBoardView, Stage } from '~/data-access/app.model';
import { AppService } from '~/data-access/app.service';
import { interviewerFeature } from '~/store/features/interviewer.feature';
import { stageFeature } from '~/store/features/stages.feature';
import { BoardStore } from './board.store';
import { BoardColumnComponent } from './ui/board-column/board-column.component';
import { HeaderComponent } from './ui/header/header.component';

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
  providers: [provideComponentStore(BoardStore)]
})
export class BoardComponent {
  private readonly cStore = inject(BoardStore);
  private readonly store = inject(Store);
  private readonly appService = inject(AppService);

  vm$ = this.cStore
    .select(
      this.cStore.state$,
      this.store.select(interviewerFeature.selectData),
      this.store.select(stageFeature.selectData),
      (state, interviewers, stages) => ({ ...state, interviewers, stages })
    )
    .pipe(
      distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
      tap((x) => console.log('vm:', x))
    );

  getConnectedList(stages: Stage[], id: number) {
    return stages.filter((x) => x.id !== id);
  }

  drop(event: CdkDragDrop<CandidateBoardView[]>) {
    console.log(event);
    this.cStore
      .select(
        ({ candidates }) =>
          candidates[+event.previousContainer.id][event.previousIndex]
      )
      .pipe(take(1))
      .subscribe((item) => {
        if (event.previousContainer === event.container) {
          this.dropIntoSameStage([item], event);
          return;
        }
        this.dropIntoOtherStage([item], event);
      });
  }

  private dropIntoSameStage(
    items: CandidateBoardView[],
    event: CdkDragDrop<CandidateBoardView[]>
  ) {
    // 1 item first
    const item = items?.[0];
    if (!item) {
      return;
    }

    this.cStore.patchState(({ candidates }) => {
      const container = [...candidates[+event.container.id]];
      container.splice(event.previousIndex, 1);
      container.splice(event.currentIndex, 0, item);
      return {
        candidates: { ...candidates, [`${event.container.id}`]: container }
      };
    });
  }

  private dropIntoOtherStage(
    items: CandidateBoardView[],
    event: CdkDragDrop<CandidateBoardView[]>
  ) {
    // 1 item first
    const item = items?.[0];
    if (!item) {
      return;
    }
    const prevStage = event.previousContainer.id;
    const curStage = event.container.id;

    this.cStore.patchState((state) => {
      const previous = [...state.candidates[+prevStage]];
      const container = [...state.candidates[+curStage]];
      previous.splice(event.previousIndex, 1);
      container.splice(event.currentIndex, 0, item);
      return {
        candidates: {
          ...state.candidates,
          [`${prevStage}`]: previous,
          [`${curStage}`]: container
        }
      };
    });
    this.appService.updateCandidateStage([item.id], +curStage).subscribe({
      next: () => {},
      error: (e) => {
        alert(e);
        console.error(e);
      }
    });
  }
}
