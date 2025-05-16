import { Component } from '@angular/core';
import { GroupGeneratorService, Person, Group }from '../../core/group-generator.service';

@Component({
  selector: 'app-group-generator',
  templateUrl: './group-generator.component.html',
  styleUrls: ['./group-generator.component.css'],
})
export class GroupGeneratorComponent {
  persons: Person[] = []; // À alimenter avec ta liste de personnes (mock ou service)
  groups: Group[] = [];

  groupCount = 2;
  criteria = {
    mixFormerDwwm: true,
    mixAges: false,
  };

  constructor(private groupGeneratorService: GroupGeneratorService) {
    // Exemple de données mock (à remplacer par données réelles)
    this.persons = [
      { id: 1, lastName: 'Dupont', gender: 'masculin', frenchLevel: 3, isFormerDwwm: true, technicalLevel: 2, profile: 'timide', age: 25 },
      { id: 2, lastName: 'Martin', gender: 'féminin', frenchLevel: 4, isFormerDwwm: false, technicalLevel: 3, profile: 'à l’aise', age: 30 },
      { id: 3, lastName: 'Durand', gender: 'masculin', frenchLevel: 2, isFormerDwwm: true, technicalLevel: 1, profile: 'réservé', age: 22 },
      { id: 4, lastName: 'Leroy', gender: 'féminin', frenchLevel: 1, isFormerDwwm: false, technicalLevel: 4, profile: 'timide', age: 28 },
      // Ajoute plus de personnes ici
    ];
  }

  generate() {
    this.groups = this.groupGeneratorService.generateGroups(
      this.persons,
      this.groupCount,
      this.criteria
    );
  }
}
