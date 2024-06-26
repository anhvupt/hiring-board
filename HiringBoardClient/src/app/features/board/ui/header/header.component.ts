import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import {
  TuiButtonModule,
  TuiRootModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiStringifyContentPipeModule
} from '@taiga-ui/kit';
import { debounceTime, map, pipe, tap } from 'rxjs';
import { CandidateParams, Interviewer } from '~/data-access/app.model';
import { interviewerFeature } from '~/store/features/interviewer.feature';
import { BoardStore } from '../../board.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TuiRootModule,
    TuiInputModule,
    FormsModule,
    TuiComboBoxModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiInputDateModule,
    RouterLink,
    PushPipe,
    FormsModule,
    ReactiveFormsModule,
    TuiStringifyContentPipeModule,
    TuiFilterByInputPipeModule,
    LetDirective,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styles: `
    tui-input input {
      @apply bg-gray-200 border-gray-200;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private formConfigs = {
    search: '',
    interviewer: null as null | Interviewer,
    createdDate: null
  };

  private readonly cStore = inject(BoardStore);
  private readonly store = inject(Store);

  readonly paramsForm = inject(FormBuilder).group(this.formConfigs);

  readonly vm$ = this.cStore
    .select(
      this.store.select(interviewerFeature.selectData),
      this.cStore.isLoading$,
      (interviewers, isLoading) => ({ interviewers, isLoading })
    )
    .pipe(takeUntilDestroyed());

  readonly stringify = (item: Interviewer) => item.name;
  readonly getId = (item: Interviewer) => item.id.toString();

  constructor() {
    this.loadCandidates(
      this.paramsForm.valueChanges.pipe(
        debounceTime(300),
        map((x) => ({
          search: x.search ?? null,
          createdDate: x.createdDate ?? null,
          interviewerId: x.interviewer?.id.toString() ?? null
        }))
      )
    );
  }

  private loadCandidates = this.cStore.effect<Partial<CandidateParams>>(
    pipe(
      tap((value) => this.cStore.reloadBoard(value)),
      takeUntilDestroyed()
    )
  );
}
