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
  position: string;
  email: string;
  phone: string;
  notes: string;
  interviewer: string;
  createdDate: Date;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  notes: string;
  interviewerId: number;
  stageId: number;
  createdDate: Date;
}

export interface StageUpdate {
  id: number[];
  stageId: string;
}

export interface CandidateParams {
  interviewerId: string | null;
  search: string | null;
  createdDate: Date | null;
}
