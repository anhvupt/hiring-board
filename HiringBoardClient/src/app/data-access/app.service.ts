import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Board, Candidate, Stage } from './app.model';

@Injectable({ providedIn: 'root' })
export class AppService {
  http = inject(HttpClient);
  apiUrl = 'api/interviews';

  getStages() {
    return this.http.get<Stage[]>(`${this.apiUrl}/stages`);
  }

  getInterviewers() {
    return this.http.get<Stage[]>(`${this.apiUrl}/interviewers`);
  }

  getCandidates() {
    return this.http.get<Board>(`${this.apiUrl}/candidates`);
  }

  getCandidateId(id: string) {
    return this.http.get<Board>(`${this.apiUrl}/candidates/${id}`);
  }

  createCandidate(model: Candidate) {
    return this.http.post(`${this.apiUrl}/candidates`, model);
  }

  updateCandidate(model: Candidate) {
    return this.http.put(`${this.apiUrl}/candidates/${model.id}`, model);
  }

  updateCandidateStage(ids: number[], stageId: number) {
    return this.http.patch(`${this.apiUrl}/candidates/stages`, {
      ids,
      stageId
    });
  }
}
