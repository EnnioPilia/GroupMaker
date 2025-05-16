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
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent {
  lists: Group[] = [];
  newListName = '';
  errorMessage = '';
  selectedListId: number | null = null;

  nextListId = 1;
  nextPersonId = 1;

  // Person form data
  formPerson: Person = this.getEmptyPerson();
  isEditMode = false;

  constructor() {
    // Initialize with some empty data if you want
  }

  addList() {
    if (!this.newListName.trim()) return;
    if (this.lists.find(l => l.name.toLowerCase() === this.newListName.trim().toLowerCase())) {
      this.errorMessage = 'Le nom existe déjà';
      return;
    }

    this.lists.push({
      id: this.nextListId++,
      name: this.newListName.trim(),
      persons: []
    });

    this.newListName = '';
    this.errorMessage = '';
  }

  deleteList(id: number) {
    this.lists = this.lists.filter(l => l.id !== id);
    if (this.selectedListId === id) this.selectedListId = null;
  }

  selectList(id: number) {
    this.selectedListId = this.selectedListId === id ? null : id;
    this.cancelPersonForm();
  }

  get selectedList(): Group | undefined {
    return this.lists.find(l => l.id === this.selectedListId!);
  }

  get persons(): Person[] {
    return this.selectedList ? this.selectedList.persons : [];
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

  submitPerson() {
    if (!this.selectedList) {
      alert("Sélectionnez une liste d'abord");
      return;
    }

    if (this.isEditMode) {
      const idx = this.selectedList.persons.findIndex(p => p.id === this.formPerson.id);
      if (idx > -1) this.selectedList.persons[idx] = { ...this.formPerson };
    } else {
      this.formPerson.id = this.nextPersonId++;
      this.selectedList.persons.push({ ...this.formPerson });
    }

    this.cancelPersonForm();
  }

  edit(person: Person) {
    this.formPerson = { ...person };
    this.isEditMode = true;
  }

  deletePerson(personId: number) {
    if (!this.selectedList) return;
    this.selectedList.persons = this.selectedList.persons.filter(p => p.id !== personId);
    this.cancelPersonForm();
  }

  cancelPersonForm() {
    this.formPerson = this.getEmptyPerson();
    this.isEditMode = false;
  }
}
