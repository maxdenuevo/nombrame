export type Gender = 'f' | 'm' | 'x';

export interface Name {
  id: string;
  name: string;
  gender: Gender;
  origin: string;
  meaning: string;
}
