import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { Store, createSelector } from '@ngrx/store';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiStringifyContentPipeModule,
  TuiTextareaModule
} from '@taiga-ui/kit';
import { Observable, filter, map, take, tap } from 'rxjs';
import { Candidate, Interviewer, Stage } from '~/data-access/app.model';
import { interviewerFeature } from '~/store/features/interviewer.feature';
import { stageFeature } from '~/store/features/stages.feature';

const emailPattern: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiStringifyContentPipeModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiButtonModule,
    FormsModule,
    TuiTextareaModule,
    RouterLink,
    PushPipe
  ],
  templateUrl: './candidate-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateFormComponent {
  private readonly store = inject(Store);
  private formConfigs: Partial<{ [key in keyof Candidate]: unknown }> & {
    interviewer: [Interviewer | null, unknown];
    stage: [Stage | null, unknown];
  } = {
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    position: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    phone: ['', Validators.required],
    interviewer: [null, Validators.required],
    stage: [null, Validators.required],
    notes: ['']
  };

  readonly form = inject(FormBuilder).group(this.formConfigs);
  readonly stringify = ({ name }: { name: string }) => name;

  @Input() set model(model: Partial<Candidate>) {
    this.toFormValue(model).subscribe((value) => this.form.patchValue(value));
  }
  @Input() isLoading = true;

  @Output() save = new EventEmitter<Candidate>();

  readonly vm$ = this.store.select(
    createSelector(
      [stageFeature.selectData, interviewerFeature.selectData],
      (stages, interviewers) => ({ stages, interviewers })
    )
  );

  saved() {
    console.log(this.form);
    if (this.form.invalid) {
      return;
    }
    const model = this.toModel(this.form.value);
    if (!model) {
      console.error('form value is invalid', this.form.value);
      return;
    }
    this.save.next(model);
  }

  private toFormValue(
    model: Partial<Candidate>
  ): Observable<typeof this.form.value> {
    return this.vm$.pipe(
      filter((x) => Object.values(x).every((arr) => arr.length)),
      map(({ stages, interviewers }) => ({
        ...model,
        interviewer: interviewers.find((x) => x.id === model?.interviewerId),
        stage: stages.find((x) => x.id === model?.stageId)
      })),
      take(1)
    );
  }

  private toModel(formValue: typeof this.form.value): Candidate | undefined {
    const isValid = (
      formValue: typeof this.form.value
    ): formValue is { interviewer: { id: number }; stage: { id: number } } => {
      return ['interviewer', 'stage'].every((x) => x in formValue);
    };

    if (!isValid(formValue)) {
      return undefined;
    }
    return {
      ...(formValue as unknown as Candidate),
      interviewerId: formValue.interviewer.id,
      stageId: formValue.stage.id
    };
  }
}
