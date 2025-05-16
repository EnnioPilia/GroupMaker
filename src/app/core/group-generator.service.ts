import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ListService, List, Person } from './../core/list.services';




export interface Group {
  id: string;
  name: string;
  members: Person[];
}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-group-generator',
  templateUrl: './group-generator.component.html',
  styleUrls: ['./group-generator.component.css'],
  imports: [CommonModule, FormsModule]
})

export class GroupGeneratorService {

  constructor() { }

  generateGroups(persons: Person[], nbGroups: number, criteria: any): Group[] | null {
    if (!persons || persons.length === 0 || nbGroups <= 0) {
      return null;
    }

    // Simple exemple : répartir les personnes en nbGroups groupes équilibrés
    const groups: Group[] = [];

    // Création des groupes vides
    for (let i = 0; i < nbGroups; i++) {
      groups.push({
        id: `group-${i + 1}`,
        name: `Groupe ${i + 1}`,
        members: []
      });
    }

    // Mélange aléatoire des personnes (pour la répartition)
    const shuffledPersons = [...persons].sort(() => Math.random() - 0.5);

    // Répartition des personnes dans les groupes
    shuffledPersons.forEach((person, index) => {
      const groupIndex = index % nbGroups;
      groups[groupIndex].members.push(person);
    });

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
