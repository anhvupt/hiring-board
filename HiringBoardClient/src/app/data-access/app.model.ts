export interface Board {
  [key: number]: CandidateBoardView[];
}

export interface Stage {
  id: number;
  name: string;
}

export interface Interviewer {
  id: number;
  name: string;
}

export interface CandidateBoardView {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  interviewer?: string;
  interviewDate?: Date;
  selected: boolean;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  interviewerId: string;
  stageId: string;
  interviewDate: Date;
}

export interface StageUpdate {
  id: number[];
  stageId: string;
}

export interface CandidateParams {
  interviewerId: string;
  search: string;
}
