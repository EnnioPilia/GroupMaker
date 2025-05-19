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
  const result = this.groupGenerator.generateGroups(this.persons, this.numberOfGroups, this.criteria);
  if (result) {
    const list = this.lists.find(l => l.id === this.selectedListId);
    const listName = list ? list.name : '';

    this.groups = result.map(group => ({
      ...group,
      listName: listName
    }));

    this.errorMessage = '';
  } else {
    this.errorMessage = 'Impossible de générer des groupes différents. Essayez de modifier les critères.';
  }
}
}