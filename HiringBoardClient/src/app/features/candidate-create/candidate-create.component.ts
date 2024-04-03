import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CandidateFormComponent } from '~/components/candidate-form/candidate-form.component';

@Component({
  selector: 'app-candidate-create',
  standalone: true,
  imports: [CandidateFormComponent],
  templateUrl: './candidate-create.component.html',
  styleUrl: './candidate-create.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateCreateComponent {}
