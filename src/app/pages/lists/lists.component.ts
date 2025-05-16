import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListService, List, Person } from '../../core/list.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent {
  lists: List[] = [];
  newListName = '';
  errorMessage = '';
  selectedListId: string | null = null;

  formPerson: Person = this.getEmptyPerson();
  isEditMode = false;

  constructor(private router: Router, private listService: ListService) {
    this.lists = this.listService.getLists();
  }

  goToGroupGenerator() {
    this.router.navigate(['/group-generator']);
  }

  addList() {
    if (!this.newListName.trim()) return;
    const success = this.listService.addList(this.newListName.trim());
    if (!success) {
      this.errorMessage = 'Le nom existe déjà';
      return;
    }
    this.lists = this.listService.getLists();
    this.newListName = '';
    this.errorMessage = '';
  }

  deleteList(id: string) {
    this.listService.deleteList(id);
    this.lists = this.listService.getLists();
    if (this.selectedListId === id) this.selectedListId = null;
  }

  selectList(id: string) {
    this.selectedListId = this.selectedListId === id ? null : id;
    this.cancelPersonForm();
  }

  get selectedList(): List | undefined {
    return this.lists.find(l => l.id === this.selectedListId!);
  }

  get persons(): Person[] {
    return this.selectedList ? this.selectedList.persons : [];
  }

  getEmptyPerson(): Person {
    return {
      id: '',
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
      this.formPerson.id = crypto.randomUUID();
      this.selectedList.persons.push({ ...this.formPerson });
    }

    // Mets à jour la liste via le service
    this.listService.updateList(this.selectedList.id, this.selectedList.name, this.selectedList.persons);

    this.lists = this.listService.getLists(); // rafraîchir la liste
    this.cancelPersonForm();
  }

  edit(person: Person) {
    this.formPerson = { ...person };
    this.isEditMode = true;
  }

  deletePerson(personId: string) {
    if (!this.selectedList) return;
    this.selectedList.persons = this.selectedList.persons.filter(p => p.id !== personId);

    // Mets à jour la liste via le service
    this.listService.updateList(this.selectedList.id, this.selectedList.name, this.selectedList.persons);

    this.lists = this.listService.getLists(); // rafraîchir la liste
    this.cancelPersonForm();
  }

  cancelPersonForm() {
    this.formPerson = this.getEmptyPerson();
    this.isEditMode = false;
  }
}
