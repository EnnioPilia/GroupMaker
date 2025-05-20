import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupGeneratorService } from '../../core/group-generator.service';
import { ListService, List } from '../../core/list.services';
import { Group } from '../../core/models/group.model';
import { Person } from '../../core/models/person.model';

@Component({
  selector: 'app-group-generator',
  standalone: true,
  templateUrl: './group-generator.component.html',
  styleUrls: ['./group-generator.component.css'],
  imports: [CommonModule, FormsModule]
})
export class GroupGeneratorComponent {
  lists: List[] = [];
  selectedListId: string | null = null;
  numberOfGroups = 2;
  errorMessage = '';

  criteria = {
    mixerAncienDwwm: false,
    mixerAge: false
  };

  constructor(
    private groupGenerator: GroupGeneratorService,
    private listService: ListService
  ) {
    this.lists = this.listService.getLists();
  }

  clearGroups() {
    this.lists.forEach(list => list.generatedGroups = []);
    this.errorMessage = '';
  }

  generateForList(listId: string) {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return;

    if (!list.persons || list.persons.length < this.numberOfGroups) {
      this.errorMessage = "Pas assez de personnes pour former autant de groupes.";
      list.generatedGroups = [];
      return;
    }

    let groups: Group[] = [];

    if (!this.criteria.mixerAncienDwwm && !this.criteria.mixerAge) {
      groups = this.generateWithoutCriteria(list.persons);
    } else if (this.criteria.mixerAncienDwwm) {
      groups = this.generateByAncienDwwmAndMaybeAge(list.persons);
    } else if (this.criteria.mixerAge) {
      groups = this.generateByAgeOnly(list.persons);
    }

    if (!groups || groups.length === 0) {
      this.errorMessage = "Impossible de générer des groupes différents. Essayez de modifier les critères.";
      list.generatedGroups = [];
    } else {
      list.generatedGroups = groups;
      this.errorMessage = '';
    }
  }

  // 🔹 Cas 1 : Aucun critère → simple mélange aléatoire
  private generateWithoutCriteria(persons: Person[]): Group[] {
    const shuffled = this.shuffleArray([...persons]);
    const groups = this.initEmptyGroups();
    this.zigzagDistribute(shuffled, groups);
    return groups;
  }

  // 🔹 Cas 2 : Mixer DWWM, peut-être avec l'âge
  private generateByAncienDwwmAndMaybeAge(persons: Person[]): Group[] {
    const anciens = persons.filter(p => p.isFormerDwwm);
    const autres = persons.filter(p => !p.isFormerDwwm);

    const groups = this.initEmptyGroups();

    // Répartition des anciens DWWM
    const shuffledAnciens = this.shuffleArray(anciens);
    this.zigzagDistribute(shuffledAnciens, groups);

    // Trier les autres par âge
    const sortedAutres = [...autres].sort((a, b) => a.age - b.age);
    const offset = Math.floor(Math.random() * this.numberOfGroups);

    sortedAutres.forEach((person, i) => {
      const groupIndex = (i + offset) % this.numberOfGroups;
      groups[groupIndex].persons.push(person);
    });

    // Tri par âge dans chaque groupe (optionnel)
    groups.forEach(group => group.persons.sort((a, b) => a.age - b.age));

    return groups;
  }

 private generateByAgeOnly(persons: Person[]): Group[] {
  // Étape 1 : trier par âge
  const sorted = [...persons].sort((a, b) => a.age - b.age);

  // Étape 2 : regrouper par tranche d’âge pour répartir les âges
  const ageBuckets: Person[][] = Array.from({ length: this.numberOfGroups }, () => []);

  sorted.forEach((person, index) => {
    ageBuckets[index % this.numberOfGroups].push(person);
  });

  // Étape 3 : on mélange chaque bucket pour casser les regroupements "naturels"
  const shuffled = this.shuffleArray(ageBuckets.flat());

  // Étape 4 : créer les groupes
  const groups: Group[] = Array.from({ length: this.numberOfGroups }, (_, i) => ({
    id: `group-${i + 1}`,
    name: `Groupe ${i + 1}`,
    persons: []
  }));

  // Étape 5 : distribution équilibrée des personnes
  shuffled.forEach((person, index) => {
    groups[index % this.numberOfGroups].persons.push(person);
  });

  return groups;
}


  // 🔹 Créer des groupes vides
  private initEmptyGroups(): Group[] {
    return Array.from({ length: this.numberOfGroups }, (_, i) => ({
      id: `group-${i + 1}`,
      name: `Groupe ${i + 1}`,
      persons: []
    }));
  }

  // 🔹 Répartition en zigzag (équilibrée et alternée)
  private zigzagDistribute(persons: Person[], groups: Group[]) {
    let index = 0;
    let direction = 1;

    for (const person of persons) {
      groups[index].persons.push(person);
      index += direction;

      if (index === this.numberOfGroups) {
        direction = -1;
        index = this.numberOfGroups - 2;
      } else if (index < 0) {
        direction = 1;
        index = 1;
      }
    }
  }

  // 🔹 Mélanger un tableau (Fisher-Yates)
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
