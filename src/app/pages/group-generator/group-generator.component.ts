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
    // Pas de critère : mélange simple
    const shuffled = this.shuffleArray([...list.persons]);
    groups = Array.from({ length: this.numberOfGroups }, (_, i) => ({
      id: `group-${i + 1}`,
      name: `Groupe ${i + 1}`,
      persons: []
    }));
    shuffled.forEach((person, i) => {
      groups[i % this.numberOfGroups].persons.push(person);
    });
  } else if (this.criteria.mixerAncienDwwm) {
    // Mixer ancien DWWM
    const anciens = list.persons.filter(p => p.isFormerDwwm);
    const autres = list.persons.filter(p => !p.isFormerDwwm);

    groups = Array.from({ length: this.numberOfGroups }, (_, i) => ({
      id: `group-${i + 1}`,
      name: `Groupe ${i + 1}`,
      persons: []
    }));

    const shuffledAnciens = this.shuffleArray(anciens);
    shuffledAnciens.forEach((person, i) => {
      groups[i % this.numberOfGroups].persons.push(person);
    });

    if (this.criteria.mixerAge) {
      const sortedAutres = [...autres].sort((a,b) => b.age - a.age);
      let groupIndex = 0;
      let forward = true;
      sortedAutres.forEach(person => {
        groups[groupIndex].persons.push(person);
        if (forward) {
          groupIndex++;
          if (groupIndex === this.numberOfGroups) {
            groupIndex = this.numberOfGroups - 1;
            forward = false;
          }
        } else {
          groupIndex--;
          if (groupIndex < 0) {
            groupIndex = 0;
            forward = true;
          }
        }
      });
    } else {
      const shuffledAutres = this.shuffleArray(autres);
      shuffledAutres.forEach((person, i) => {
        groups[i % this.numberOfGroups].persons.push(person);
      });
    }

  } else if (this.criteria.mixerAge) {
    // Mixer seulement âge
    const sorted = [...list.persons].sort((a,b) => b.age - a.age);
    groups = Array.from({ length: this.numberOfGroups }, (_, i) => ({
      id: `group-${i + 1}`,
      name: `Groupe ${i + 1}`,
      persons: []
    }));

    let groupIndex = 0;
    let forward = true;
    sorted.forEach(person => {
      groups[groupIndex].persons.push(person);
      if (forward) {
        groupIndex++;
        if (groupIndex === this.numberOfGroups) {
          groupIndex = this.numberOfGroups - 1;
          forward = false;
        }
      } else {
        groupIndex--;
        if (groupIndex < 0) {
          groupIndex = 0;
          forward = true;
        }
      }
    });
  }

  if (!groups || groups.length === 0) {
    this.errorMessage = "Impossible de générer des groupes différents. Essayez de modifier les critères.";
    list.generatedGroups = [];
  } else {
    list.generatedGroups = groups;
    this.errorMessage = '';
  }
}

// N’oublie pas d’ajouter cette méthode shuffle dans ta classe aussi
shuffleArray(array: any[]) {
  for (let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


}
