export interface Person {
  id: number;
  lastName: string;
  gender: 'masculin' | 'féminin' | 'ne se prononce pas';
  frenchLevel: number;  // 1 à 4
  isFormerDwwm: boolean;
  technicalLevel: number;  // 1 à 4
  profile: 'timide' | 'réservé' | 'à l’aise';
  age: number;  // 1 à 99
}
