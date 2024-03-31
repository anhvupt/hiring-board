import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import {
  TuiButtonModule,
  TuiRootModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiSelectModule
} from '@taiga-ui/kit';
import { map } from 'rxjs';
import {
  InterviewerActions,
  interviewerFeature
} from '~/store/features/interviewer.feature';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TuiRootModule,
    TuiInputModule,
    FormsModule,
    TuiSelectModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiInputDateModule,
    RouterLink,
    PushPipe
  ],
  templateUrl: './header.component.html',
  styles: `
    tui-input input {
      @apply bg-gray-200;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  items$ = inject(Store)
    .select(interviewerFeature.selectData)
    .pipe(
      map((x) => x.map(({ name }) => name)),
      takeUntilDestroyed()
    );

  control = inject(FormBuilder).control('');
  text = '';
}
