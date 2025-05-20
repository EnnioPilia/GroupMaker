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
  shuffled.forEach((person, i) => {
    groups[i % this.numberOfGroups].persons.push(person);
  });
  return groups;
}

// 🔹 Cas 2 : Mixer par ancien DWWM avec ou sans âge
private generateByAncienDwwmAndMaybeAge(persons: Person[]): Group[] {
  const anciens = persons.filter(p => p.isFormerDwwm);
  const autres = persons.filter(p => !p.isFormerDwwm);
  const groups = this.initEmptyGroups();

  const shuffledAnciens = this.shuffleArray(anciens);
  shuffledAnciens.forEach((person, i) => {
    groups[i % this.numberOfGroups].persons.push(person);
  });

  if (this.criteria.mixerAge) {
    const sortedAutres = [...autres].sort((a, b) => b.age - a.age);
    this.zigzagDistribute(sortedAutres, groups);
  } else {
    const shuffledAutres = this.shuffleArray(autres);
    shuffledAutres.forEach((person, i) => {
      groups[i % this.numberOfGroups].persons.push(person);
    });
  }

  return groups;
}

private generateByAgeOnly(persons: Person[]): Group[] {
  // Étape 1 : trier par âge (optionnel mais utile)
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

// 🔹 Initialiser des groupes vides
private initEmptyGroups(): Group[] {
  return Array.from({ length: this.numberOfGroups }, (_, i) => ({
    id: `group-${i + 1}`,
    name: `Groupe ${i + 1}`,
    persons: []
  }));
}

// 🔹 Répartition en zigzag (pour éviter de remplir toujours le même groupe)
private zigzagDistribute(persons: Person[], groups: Group[]) {
  let index = 0;
  let forward = true;
  for (const person of persons) {
    groups[index].persons.push(person);
    if (forward) {
      index++;
      if (index === this.numberOfGroups) {
        index = this.numberOfGroups - 1;
        forward = false;
      }
    } else {
      index--;
      if (index < 0) {
        index = 0;
        forward = true;
      }
    }
  }
}

// 🔹 Mélanger un tableau aléatoirement (Fisher-Yates)
private shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}





}
