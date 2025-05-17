// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ListService } from './../core/list.services';
import { Group } from './../core/models/group.model';
import { Person } from './models/person.model';

interface Criteria {
  mixerAncienDwwm: boolean;
  mixerAge: boolean;
}


@Injectable({
  providedIn: 'root'
})

// @Component({
//   selector: 'app-group-generator',
//   templateUrl: './group-generator.component.html',
//   styleUrls: ['./group-generator.component.css'],
//   imports: [CommonModule, FormsModule]
// })

export class GroupGeneratorService {

  constructor() { }

  generateGroups(persons: Person[], nbGroups: number, criteria: Criteria): Group[] | null {
    if (!persons || persons.length === 0 || nbGroups <= 0) {
      return null;
    }

    // Création des groupes vides
    const groups: Group[] = [];
    for (let i = 0; i < nbGroups; i++) {
      groups.push({
        id: `group-${i + 1}`,
        name: `Groupe ${i + 1}`,
        persons: []  // attention ici : la propriété est 'persons' (selon ton modèle)
      });
    }

    // Gestion des critères
    let filteredPersons = [...persons];

    // Tri selon les critères
    if (criteria.mixerAncienDwwm) {
      // On sépare les anciens DWWM et les autres pour mieux mélanger
      const anciens = filteredPersons.filter(p => p.isFormerDwwm);
      const autres = filteredPersons.filter(p => !p.isFormerDwwm);
      filteredPersons = [...anciens, ...autres];
    }

    if (criteria.mixerAge) {
      // Tri par âge
      filteredPersons.sort((a, b) => a.age - b.age);
    } else {
      // Sinon mélange aléatoire
      filteredPersons.sort(() => Math.random() - 0.5);
    }

    // Répartition en zigzag pour équilibrer si tri par âge
    let index = 0;
    let sens = 1;
    for (const person of filteredPersons) {
      groups[index].persons.push(person);

      if (criteria.mixerAge) {
        index += sens;
        if (index === nbGroups) {
          index = nbGroups - 1;
          sens = -1;
        } else if (index < 0) {
          index = 0;
          sens = 1;
        }
      } else {
        index = (index + 1) % nbGroups;
      }
    }

    return groups;
  }
}
export class GroupGeneratorComponent {
  persons: Person[] = [];
  numberOfGroups = 2;
  groups: Group[] | null = null;
  errorMessage = '';
  criteria = {
    mixerAncienDwwm: false,
    mixerAge: false
  };

  constructor(private groupGenerator: GroupGeneratorService, private listService: ListService) {
    this.loadPersons();
  }

  loadPersons() {
    // Récupère toutes les personnes dans toutes les listes
    this.persons = this.listService.getLists().flatMap(list => list.persons);
  }

  generate() {
    this.loadPersons(); // actualiser avant génération
    const result = this.groupGenerator.generateGroups(this.persons, this.numberOfGroups, this.criteria);
    if (result) {
      this.groups = result;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Impossible de générer des groupes différents. Essayez de modifier les critères.';
    }
  }
}
