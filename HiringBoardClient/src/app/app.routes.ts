import { BoardComponent } from './features/board/board.component';
import { Routes } from '@angular/router';
import { CandidateEditComponent } from './features/candidate-edit/candidate-edit.component';
import { CandidateCreateComponent } from './features/candidate-create/candidate-create.component';
import { CandidateDetailsComponent } from './features/candidate-details/candidate-details.component';

export const routes: Routes = [
  {
    path: '',
    component: BoardComponent
  },
  { path: 'candidate/edit/:id', component: CandidateEditComponent },
  { path: 'candidate/create', component: CandidateCreateComponent },
  {
    path: 'candidate/:id',
    component: CandidateDetailsComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
