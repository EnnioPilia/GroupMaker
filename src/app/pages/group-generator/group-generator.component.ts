import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ListService, List } from '../../core/list.services';
import { Group } from '../../core/models/group.model';
import { Person } from '../../core/models/person.model';
import { GroupHistoryComponent } from '../group-history/group-history.component';

@Component({
  selector: 'app-group-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, GroupHistoryComponent],
  templateUrl: './group-generator.component.html',
  styleUrls: ['./group-generator.component.css'],
})
export class GroupGeneratorComponent implements OnInit {
  @ViewChild(GroupHistoryComponent)
  groupHistoryComponent?: GroupHistoryComponent;

  list: List | null = null;
  listId: string | null = null;
  numberOfGroups = 2;
  errorMessage = '';

  criteria = {
    mixerAncienDwwm: false,
    mixerAge: false,
  };

  constructor(
    private route: ActivatedRoute,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('listId');

    if (!this.listId) {
      this.errorMessage = 'Aucune liste sélectionnée.';
      return;
    }

    const list = this.listService.getLists().find((l) => l.id === this.listId);

    if (!list) {
      this.errorMessage = 'Liste introuvable.';
      return;
    }

    // Sécurisation des champs attendus
    if (!list.groupNames) {
      list.groupNames = [];
    }

    if (!list.generatedGroups) {
      list.generatedGroups = [];
    }

    this.list = list;
  }

  clearGroups() {
    if (this.list) {
      this.list.generatedGroups = [];
      this.errorMessage = '';
    }
  }

  generateGroups() {
    if (
      !this.list ||
      !this.list.persons ||
      this.list.persons.length < this.numberOfGroups
    ) {
      this.errorMessage = 'Pas assez de personnes.';
      return;
    }

    let groups: Group[] = [];

    if (!this.criteria.mixerAncienDwwm && !this.criteria.mixerAge) {
      groups = this.generateWithoutCriteria(this.list.persons);
    } else if (this.criteria.mixerAncienDwwm) {
      groups = this.generateByAncienDwwmAndMaybeAge(this.list.persons);
    } else if (this.criteria.mixerAge) {
      groups = this.generateByAgeOnly(this.list.persons);
    }

    if (!groups.length) {
      this.errorMessage =
        'Impossible de générer des groupes différents. Essayez de modifier les critères.';
      this.list.generatedGroups = [];
      return;
    }

    this.list.generatedGroups = groups;
    this.list.groupNames = groups.map((g) => g.name);
    this.list.groupsSaved = true;
    this.list.showSavedGroups = true;
    this.errorMessage = '';

    const existingHistory = JSON.parse(
      localStorage.getItem(`groups-${this.listId}`) || '[]'
    );
    existingHistory.push(groups);
    localStorage.setItem(
      `groups-${this.listId}`,
      JSON.stringify(existingHistory)
    );

    this.groupHistoryComponent?.reload();
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
    const anciens = persons.filter((p) => p.isFormerDwwm);
    const autres = persons.filter((p) => !p.isFormerDwwm);

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
    groups.forEach((group) => group.persons.sort((a, b) => a.age - b.age));

    return groups;
  }

  private generateByAgeOnly(persons: Person[]): Group[] {
    // Étape 1 : trier par âge
    const sorted = [...persons].sort((a, b) => a.age - b.age);

    // Étape 2 : regrouper par tranche d’âge pour répartir les âges
    const ageBuckets: Person[][] = Array.from(
      { length: this.numberOfGroups },
      () => []
    );

    sorted.forEach((person, index) => {
      ageBuckets[index % this.numberOfGroups].push(person);
    });

    // Étape 3 : on mélange chaque bucket pour casser les regroupements "naturels"
    const shuffled = this.shuffleArray(ageBuckets.flat());

    // Étape 4 : créer les groupes
    const groups: Group[] = Array.from(
      { length: this.numberOfGroups },
      (_, i) => ({
        id: `group-${i + 1}`,
        name: `Groupe ${i + 1}`,
        persons: [],
      })
    );

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
      persons: [],
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
