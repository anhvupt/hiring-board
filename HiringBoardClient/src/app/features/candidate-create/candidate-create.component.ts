import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-candidate-create',
  standalone: true,
  imports: [],
  templateUrl: './candidate-create.component.html',
  styleUrl: './candidate-create.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateCreateComponent {

}
