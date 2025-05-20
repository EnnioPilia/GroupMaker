import { Injectable } from '@angular/core';
import { Person } from './models/person.model';


@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private personsByList: { [listId: string]: Person[] } = {};
  private nextId = 1;

  getPersons(listId: string): Person[] {
    return this.personsByList[listId] || [];
  }
addPersonsToList(listId: string, persons: Person[]) {
  this.personsByList[listId] = persons;
}

  addPerson(listId: string, person: Person) {
    person.id = crypto.randomUUID();
    if (!this.personsByList[listId]) {
      this.personsByList[listId] = [];
    }
    this.personsByList[listId].push(person);
  }

  updatePerson(listId: string, updated: Person) {
    const list = this.personsByList[listId];
    if (!list) return;

    const index = list.findIndex(p => p.id === updated.id);
    if (index > -1) {
      list[index] = updated;
    }
  }

// deletePerson(personId: string) {
//   if (!this.selectedListId) return;

//   const list = this.lists.find(l => l.id === this.selectedListId);
//   if (!list) return;

//   list.persons = list.persons.filter(p => p.id !== personId);
//   this.listService.updateList(list.id, list.name, list.persons);

//   this.persons = list.persons;  // Mettre à jour la vue
// }
deletePerson(listId: string, personId: string) {
  const persons = this.personsByList[listId];
  if (!persons) return;

  this.personsByList[listId] = persons.filter(p => p.id !== personId);
}

}