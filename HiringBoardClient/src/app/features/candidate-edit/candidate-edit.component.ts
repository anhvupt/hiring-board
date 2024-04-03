import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CandidateFormComponent } from '~/components/candidate-form/candidate-form.component';

@Component({
  selector: 'app-candidate-edit',
  standalone: true,
  imports: [CandidateFormComponent],
  templateUrl: './candidate-edit.component.html',
  styleUrl: './candidate-edit.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateEditComponent {}
