import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-candidate-edit',
  standalone: true,
  imports: [],
  templateUrl: './candidate-edit.component.html',
  styleUrl: './candidate-edit.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateEditComponent {

}
