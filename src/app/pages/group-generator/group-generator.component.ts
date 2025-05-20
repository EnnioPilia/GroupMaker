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

    const result = this.groupGenerator.generateGroups(list.persons, this.numberOfGroups, this.criteria);

    if (!result || result.length === 0) {
      this.errorMessage = "Impossible de générer des groupes différents. Essayez de modifier les critères.";
      list.generatedGroups = [];
    } else {
      list.generatedGroups = result.map((group, i) => ({
        ...group,
        name: `Groupe ${i + 1}`,
        listName: list.name
      }));
      this.errorMessage = '';
    }
  }
}
