import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { GroupGeneratorService } from '../../core/group-generator.service';
import { ListService } from '../../core/list.services';
import { Group } from '../../core/models/group.model';
import { Person } from '../../core/models/person.model';

@Component({
  selector: 'app-group-generator',
  templateUrl: './group-generator.component.html',
  styleUrls: ['./group-generator.component.css'],
  imports: [CommonModule,FormsModule]
})

export class GroupGeneratorComponent {
  persons: Person[] = [];  // Ici tu dois récupérer ta liste réelle des personnes à grouper
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
    this.persons = this.listService.getLists().flatMap(list => list.persons);
  }

  generate() {
    const result = this.groupGenerator.generateGroups(this.persons, this.numberOfGroups, this.criteria);
    if (result) {
      this.groups = result;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Impossible de générer des groupes différents. Essayez de modifier les critères.';
    }
  }
}
