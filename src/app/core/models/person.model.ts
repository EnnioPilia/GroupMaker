export interface Person {
  id: number;       // id en number
  lastName: string;
  gender: 'masculin' | 'féminin' | 'ne se prononce pas';
  frenchLevel: number;
  isFormerDwwm: boolean;
  technicalLevel: number;
  profile: 'timide' | 'réservé' | 'à l’aise';
  age: number;
}
