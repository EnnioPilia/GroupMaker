import { Injectable } from '@angular/core';
import { Group } from './models/group.model';
import { Person } from './models/person.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groups: Group[] = [];

  constructor() {
    // Exemple de groupe initial avec quelques personnes
    this.groups = [
      {
        id: '1',
        name: 'Groupe 1',
        persons: [
          { id: 1, lastName: 'Dupont', gender: 'masculin', frenchLevel: 3, isFormerDwwm: false, technicalLevel: 2, profile: 'à l’aise', age: 28 },
          { id: 2, lastName: 'Durand', gender: 'féminin', frenchLevel: 2, isFormerDwwm: true, technicalLevel: 3, profile: 'timide', age: 32 }
        ]
      }
    ];
  }

  getGroups(): Group[] {
    return this.groups;
  }

  getGroupById(id: string): Group | undefined {
    return this.groups.find(g => g.id === id);
  }

  addGroup(name: string, persons: Person[] = []): boolean {
    if (this.groups.find(g => g.name === name)) {
      return false; // nom déjà utilisé
    }
    const newGroup: Group = {
      id: (this.groups.length + 1).toString(),
      name,
      persons
    };
    this.groups.push(newGroup);
    return true;
  }

  deleteGroup(id: string): void {
    this.groups = this.groups.filter(g => g.id !== id);
  }
}
