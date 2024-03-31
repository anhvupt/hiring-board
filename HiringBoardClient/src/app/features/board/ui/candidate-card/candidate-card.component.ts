import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Candidate } from '../../../../data-access/app.model';

@Component({
  selector: 'app-candidate-card',
  standalone: true,
  imports: [],
  templateUrl: './candidate-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateCardComponent {
  @Input({ required: true }) candidate!: Candidate;
}
