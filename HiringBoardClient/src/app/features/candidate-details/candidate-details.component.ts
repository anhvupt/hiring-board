import { Candidate } from '~/data-access/app.model';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, take, tap, pipe } from 'rxjs';
import { CandidateFormComponent } from '~/components/candidate-form/candidate-form.component';
import {
  ComponentStore,
  provideComponentStore,
  tapResponse
} from '@ngrx/component-store';
import { AppService } from '~/data-access/app.service';
import { CommonModule } from '@angular/common';
import { PushPipe } from '@ngrx/component';

const initialState = {
  candidate: null as unknown as Candidate,
  isLoading: true
};

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [CandidateFormComponent, CommonModule, PushPipe],
  templateUrl: './candidate-details.component.html',
  styleUrl: './candidate-details.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(ComponentStore)]
})
export class CandidateDetailsComponent implements OnInit {
  private readonly id$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('id'))
  );
  private readonly store =
    inject<ComponentStore<typeof initialState>>(ComponentStore);
  private readonly appService = inject(AppService);
  private readonly router = inject(Router);

  vm$ = this.store.select(({ candidate, isLoading }) => ({
    candidate,
    isLoading
  }));

  constructor() {
    this.store.setState(initialState);
  }

  ngOnInit(): void {
    this.loadCandidate(
      this.id$.pipe(
        filter((x) => !!x),
        map((x) => String(x))
      )
    );
  }

  saved(model: Candidate) {
    console.log(model);
    this.id$
      .pipe(
        take(1),
        tap((id) => {
          if (!id) {
            console.error('id must not be null');
            return;
          }
        }),
        filter((x) => !!x),
        map((id) => +(id as string)),
        switchMap((id) => this.appService.updateCandidate({ ...model, id })),
        tapResponse({
          next: () => alert('successfully updated'),
          error: console.error
        })
      )
      .subscribe(() => this.router.navigate(['/']));
  }

  private readonly loadCandidate = this.store.effect<string>(
    pipe(
      tap(() => this.store.patchState({ isLoading: true })),
      switchMap((id) =>
        this.appService.getCandidateById(id).pipe(
          tapResponse({
            next: (candidate) =>
              this.store.patchState({ candidate, isLoading: false }),
            error: console.error
          })
        )
      )
    )
  );
}
