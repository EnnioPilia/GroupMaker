import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Person {
  id: number;
  lastName: string;
  gender: string;
  frenchLevel: number;
  isFormerDwwm: boolean;
  technicalLevel: number;
  profile: string;
  age: number;
}

interface Group {
  id: number;
  name: string;
  persons: Person[];
}
@Component({
  selector: 'app-group-persons',
  // standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-persons.component.html',
  styleUrls: ['./group-persons.component.css']
})

export class GroupPersonsComponent {
  groups: Group[] = [];
  nextGroupId = 1;
  nextPersonId = 1;

  newGroupName = '';
  selectedGroupId: number | null = null;

  formPerson: Person = this.getEmptyPerson();
  isEditMode = false;

  addGroup() {
    if (!this.newGroupName.trim()) return;
    this.groups.push({
      id: this.nextGroupId++,
      name: this.newGroupName.trim(),
      persons: []
    });
    this.newGroupName = '';
  }

  selectGroup(id: number) {
    this.selectedGroupId = id;
    this.cancelPersonForm();
  }

  get persons(): Person[] {
    if (this.selectedGroupId === null) return [];
    const group = this.groups.find(g => g.id === this.selectedGroupId);
    return group ? group.persons : [];
  }

  getEmptyPerson(): Person {
    return {
      id: 0,
      lastName: '',
      gender: 'masculin',
      frenchLevel: 1,
      isFormerDwwm: false,
      technicalLevel: 1,
      profile: 'timide',
      age: 18,
    };
  }

get selectedGroupName(): string | undefined {
  return this.groups.find(g => g.id === this.selectedGroupId)?.name;
}

submitPerson(event?: Event) {
  if (event) event.preventDefault();

  if (this.selectedGroupId === null) return alert('Sélectionnez un groupe d\'abord');

  const group = this.groups.find(g => g.id === this.selectedGroupId);
  if (!group) return;

  if (this.isEditMode) {
    const index = group.persons.findIndex(p => p.id === this.formPerson.id);
    if (index > -1) group.persons[index] = { ...this.formPerson };
  } else {
    this.formPerson.id = this.nextPersonId++;
    group.persons.push({ ...this.formPerson });
  }

  this.cancelPersonForm();
}


  edit(person: Person) {
    this.formPerson = { ...person };
    this.isEditMode = true;
  }

  delete(personId: number) {
    if (this.selectedGroupId === null) return;
    const group = this.groups.find(g => g.id === this.selectedGroupId);
    if (!group) return;

    group.persons = group.persons.filter(p => p.id !== personId);
    this.cancelPersonForm();
  }

  cancelPersonForm() {
    this.formPerson = this.getEmptyPerson();
    this.isEditMode = false;
  }
}
