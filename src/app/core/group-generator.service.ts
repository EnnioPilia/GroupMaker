import { Injectable } from '@angular/core';

export interface Person {
  id: number;
  lastName: string;
  gender: string;
  frenchLevel: number;
  isFormerDwwm: boolean;
  technicalLevel: number;
  profile: string;
  age: number;
}

export interface Group {
  id: number;
  name: string;
  persons: Person[];
}

@Injectable({
  providedIn: 'root',
})
export class GroupGeneratorService {
  private history: Group[][] = [];

  constructor() {}

  generateGroups(
    persons: Person[],
    groupCount: number,
    criteria: { mixFormerDwwm: boolean; mixAges: boolean }
  ): Group[] {
    if (groupCount < 1) return [];

    // Initialiser les groupes
    const groups: Group[] = [];
    for (let i = 0; i < groupCount; i++) {
      groups.push({ id: i + 1, name: `Groupe ${i + 1}`, persons: [] });
    }

    // Exemple simple de mixage selon ancien DWWM (répartir les anciens DWWM d'abord)
    let formerDwwm = persons.filter((p) => p.isFormerDwwm);
    let others = persons.filter((p) => !p.isFormerDwwm);

    // Répartir les anciens DWWM
    formerDwwm.forEach((person, i) => {
      groups[i % groupCount].persons.push(person);
    });

    // Puis les autres
    others.forEach((person, i) => {
      groups[i % groupCount].persons.push(person);
    });

    // TODO: ajouter mixage sur les âges et autres critères si besoin

    // Historique simple : stocker ce tirage
    this.history.push(groups.map(g => ({ ...g, persons: [...g.persons] })));

    return groups;
  }

  getHistory(): Group[][] {
    return this.history;
  }
}
