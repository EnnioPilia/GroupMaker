import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupGeneratorService } from '../../core/group-generator.service';
import { ListService, List } from '../../core/list.services';
import { Group } from '../../core/models/group.model';
import { Person } from '../../core/models/person.model';
import { GroupHistoryComponent } from '../group-history/group-history.component';

@Component({
  selector: 'app-group-generator',
  templateUrl: './group-generator.component.html',
  styleUrls: ['./group-generator.component.css'],
  imports: [CommonModule, FormsModule, GroupHistoryComponent],
})
export class GroupGeneratorComponent implements OnInit {
  @ViewChild(GroupHistoryComponent) groupHistoryComponent?: GroupHistoryComponent;

  lists: List[] = [];
  selectedListId: string | null = null;
  numberOfGroups = 2;
  errorMessage = '';

  criteria = {
    mixerAncienDwwm: false,
    mixerAge: false,
  };

  constructor(
    private groupGenerator: GroupGeneratorService,
    private listService: ListService
  ) {}

  ngOnInit() {
    // Charger les listes
    this.lists = this.listService.getLists();

    // Initialisation des listes (ajout des propriétés nécessaires)
    this.lists.forEach((list) => {
      if (!list.groupNames) {
        list.groupNames = [];
      }
      // Ne pas afficher les groupes générés à la réouverture
      list.generatedGroups = [];
      // Toujours afficher l'historique s'il existe dans le localStorage
      const history = localStorage.getItem(`groups-${list.id}`);
      list.groupsSaved = history !== null && JSON.parse(history).length > 0;
      list.showSavedGroups = list.groupsSaved;
    });
  }

deleteSavedGroups(listId: string) {
  // Supprime l'historique dans localStorage
  localStorage.removeItem(`groups-${listId}`);

  // Trouve la liste concernée
  const list = this.lists.find((l) => l.id === listId);
  if (list) {
    // Vide les groupes générés et met à jour les flags
    list.generatedGroups = [];
    list.groupsSaved = false;
    list.showSavedGroups = false;
  }

  // Recharge l'historique affiché
  this.groupHistoryComponent?.reload();
}


  generateForList(listId: string) {
    this.selectedListId = listId;
    const list = this.lists.find((l) => l.id === listId);
    if (!list) return;

    if (!list.persons || list.persons.length < this.numberOfGroups) {
      this.errorMessage = 'Pas assez de personnes pour former autant de groupes.';
      list.generatedGroups = [];
      return;
    }

    let groups: Group[] = [];

    // Forcer la liste 2 à ne pas utiliser les critères
    if (listId === 'id_de_la_liste_2') {
      groups = this.generateWithoutCriteria(list.persons);
    } else {
      if (!this.criteria.mixerAncienDwwm && !this.criteria.mixerAge) {
        groups = this.generateWithoutCriteria(list.persons);
      } else if (this.criteria.mixerAncienDwwm) {
        groups = this.generateByAncienDwwmAndMaybeAge(list.persons);
      } else if (this.criteria.mixerAge) {
        groups = this.generateByAgeOnly(list.persons);
      }
    }

    if (!groups || groups.length === 0) {
      this.errorMessage = 'Impossible de générer des groupes différents. Essayez de modifier les critères.';
      list.generatedGroups = [];
      return;
    }

    // Option 1 : afficher temporairement les groupes générés (1 sec), puis vider
    list.generatedGroups = groups;
    list.groupNames = groups.map((g) => g.name);
    list.groupsSaved = true;
    list.showSavedGroups = true;
    this.errorMessage = '';

    // Sauvegarder dans localStorage (historique)
    const existingHistory = JSON.parse(localStorage.getItem(`groups-${listId}`) || '[]');
    existingHistory.push(groups);
    localStorage.setItem(`groups-${listId}`, JSON.stringify(existingHistory));

    this.groupHistoryComponent?.reload();

    // Vider generatedGroups après 1 seconde pour ne pas les garder dans le générateur

  }

  // --- Méthodes de génération ---

  private generateWithoutCriteria(persons: Person[]): Group[] {
    const shuffled = this.shuffleArray([...persons]);
    const groups = this.initEmptyGroups();
    this.zigzagDistribute(shuffled, groups);
    return groups;
  }

  private generateByAncienDwwmAndMaybeAge(persons: Person[]): Group[] {
    const anciens = persons.filter((p) => p.isFormerDwwm);
    const autres = persons.filter((p) => !p.isFormerDwwm);

    const groups = this.initEmptyGroups();

    const shuffledAnciens = this.shuffleArray(anciens);
    this.zigzagDistribute(shuffledAnciens, groups);

    const sortedAutres = [...autres].sort((a, b) => a.age - b.age);
    const offset = Math.floor(Math.random() * this.numberOfGroups);

    sortedAutres.forEach((person, i) => {
      const groupIndex = (i + offset) % this.numberOfGroups;
      groups[groupIndex].persons.push(person);
    });

    groups.forEach((group) => group.persons.sort((a, b) => a.age - b.age));

    return groups;
  }

  private generateByAgeOnly(persons: Person[]): Group[] {
    const sorted = [...persons].sort((a, b) => a.age - b.age);

    const ageBuckets: Person[][] = Array.from(
      { length: this.numberOfGroups },
      () => []
    );

    sorted.forEach((person, index) => {
      ageBuckets[index % this.numberOfGroups].push(person);
    });

    const shuffled = this.shuffleArray(ageBuckets.flat());

    const groups: Group[] = Array.from(
      { length: this.numberOfGroups },
      (_, i) => ({
        id: `group-${i + 1}`,
        name: `Groupe ${i + 1}`,
        persons: [],
      })
    );

    shuffled.forEach((person, index) => {
      groups[index % this.numberOfGroups].persons.push(person);
    });

    return groups;
  }

  private initEmptyGroups(): Group[] {
    return Array.from({ length: this.numberOfGroups }, (_, i) => ({
      id: `group-${i + 1}`,
      name: `Groupe ${i + 1}`,
      persons: [],
    }));
  }

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

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  updateGroupNames(list: List) {
    if (!list.generatedGroups || !list.groupNames) return;

    list.generatedGroups.forEach((group, i) => {
      if (list.groupNames && list.groupNames[i]) {
        group.name = list.groupNames[i];
      }
    });
  }

  toggleSavedGroupsVisibility(list: List) {
    list.showSavedGroups = !list.showSavedGroups;
  }
}
