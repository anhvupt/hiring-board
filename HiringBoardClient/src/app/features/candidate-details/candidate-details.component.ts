import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [],
  templateUrl: './candidate-details.component.html',
  styleUrl: './candidate-details.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateDetailsComponent {

}
