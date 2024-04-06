import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { Observable, map } from 'rxjs';
import { CandidateFormComponent } from '~/components/candidate-form/candidate-form.component';
import { Candidate } from '~/data-access/app.model';
import { AppService } from '~/data-access/app.service';

@Component({
  selector: 'app-candidate-create',
  standalone: true,
  imports: [CandidateFormComponent, PushPipe],
  templateUrl: './candidate-create.component.html',
  styleUrl: './candidate-create.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateCreateComponent {
  private readonly appService = inject(AppService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  defaultInfo$: Observable<Partial<Candidate>> = this.route.queryParamMap.pipe(
    map((qParams) => {
      const stageId = qParams.get('stageId');
      return !stageId ? {} : { stageId: +stageId };
    })
  );

  saved(model: Candidate) {
    this.appService.createCandidate(model).subscribe({
      next: () => {
        alert('success');
        this.router.navigate(['/']);
      }
    });
  }
}
