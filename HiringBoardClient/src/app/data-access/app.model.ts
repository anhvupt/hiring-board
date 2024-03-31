export interface Board {
  [key: string]: Candidate[];
}

export interface Stage {
  id: string;
  name: string;
}

export interface Candidate {
  id: string;
  name: string;
  selected: boolean;
}
