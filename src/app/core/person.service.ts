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
}
