import { Injectable } from '@angular/core';
import { Person } from './models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  // Clé = listId, valeur = tableau des personnes associées à cette liste
  private personsByList: { [listId: number]: Person[] } = {};
  private nextId = 1;

  getPersons(listId: number): Person[] {
    return this.personsByList[listId] || [];
  }

  addPerson(listId: number, person: Person) {
    person.id = this.nextId++;
    if (!this.personsByList[listId]) {
      this.personsByList[listId] = [];
    }
    this.personsByList[listId].push(person);
  }

  updatePerson(listId: number, updated: Person) {
    const list = this.personsByList[listId];
    if (!list) return;

    const index = list.findIndex(p => p.id === updated.id);
    if (index > -1) {
      list[index] = updated;
    }
  }

  deletePerson(listId: number, personId: number) {
    if (!this.personsByList[listId]) return;

    this.personsByList[listId] = this.personsByList[listId].filter(p => p.id !== personId);
  }
}
