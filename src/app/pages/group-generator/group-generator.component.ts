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
  persons: Person[] = [];
  numberOfGroups = 2;
  groups: Group[] | null = null;
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

  loadPersons() {
    if (this.selectedListId) {
      const selectedList = this.lists.find(l => l.id === this.selectedListId);
      this.persons = selectedList ? selectedList.persons : [];
    } else {
      this.persons = [];
    }
  }

  clearGroups() {
    this.groups = null;
    this.errorMessage = '';
  }

  generate() {
    const list = this.lists.find(l => l.id === this.selectedListId);

    if (!list || !list.persons || list.persons.length < this.numberOfGroups) {
      this.errorMessage = "Pas assez de personnes pour former autant de groupes.";
      this.groups = [];
      return;
    }

    const result = this.groupGenerator.generateGroups(list.persons, this.numberOfGroups, this.criteria);

    if (!result || result.length === 0) {
      this.errorMessage = "Impossible de générer des groupes différents. Essayez de modifier les critères.";
      this.groups = [];
    } else {
      this.groups = result.map((group, i) => ({
        ...group,
        name: `Groupe ${i + 1}`,
        listName: list.name
      }));
      this.errorMessage = '';
    }
  }

  generateForList(listId: string) {
    this.selectedListId = listId;
    this.loadPersons();
    this.generate();
  }
}
