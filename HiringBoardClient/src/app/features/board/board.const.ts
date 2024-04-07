import { CandidateBoardView, Stage } from '~/data-access/app.model';

export const skeletonStage: Stage = {
  id: 0,
  name: ''
};

export const skeletonCandidate: CandidateBoardView = {
  id: 0,
  name: '',
  position: '',
  createdDate: new Date(),
  email: '',
  interviewer: '',
  notes: '',
  phone: ''
};
