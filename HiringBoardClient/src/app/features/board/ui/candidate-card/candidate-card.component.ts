import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { CandidateBoardView } from '~/data-access/app.model';

@Component({
  selector: 'app-candidate-card',
  standalone: true,
  imports: [RouterLink, TuiBadgeModule, DatePipe],
  templateUrl: './candidate-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: 'tui-badge { @apply bg-accent text-primary; }'
})
export class CandidateCardComponent {
  @Input({ required: true }) candidate!: CandidateBoardView;
}
