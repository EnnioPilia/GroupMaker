import { Component, OnInit } from '@angular/core';
import { ListService, List } from '../../core/list.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Person } from '../../core/models/person.model';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ListsComponent implements OnInit {

  lists: List[] = [];
  newListName: string = '';
  errorMessage: string = '';
  persons: Person[] = [];
  selectedListId: string | null = null;
  isEditMode: boolean = false;

  formPerson: any = {
    lastName: '',
    gender: '',
    frenchLevel: '',
    isFormerDwwm: false,
    technicalLevel: '',
    profile: '',
    age: null,
  };


  constructor(private listService: ListService, private router: Router) { }

  ngOnInit() {
    this.loadLists();
  }

  // Chargement des listes depuis le service
  loadLists() {
    this.lists = this.listService.getLists();
  }

  // Création d'une nouvelle liste
  createList() {
    const name = this.newListName.trim();
    if (name === "") {
      this.errorMessage = 'Veuillez entrer un nom de liste';
      return;
    }

    const success = this.listService.addList(name);
    if (!success) {
      this.errorMessage = 'Ce nom de liste existe déjà.';
      return;
    }

    this.newListName = '';
    this.errorMessage = '';
    this.loadLists();
  }

  // Suppression d'une liste
  deleteList(listId: string) {
    if (confirm('Voulez-vous vraiment supprimer cette liste ?')) {
      this.listService.deleteList(listId);
      this.loadLists();
    }
  }

  selectList(id: string | null) {
    if (this.selectedListId === id) {
      this.selectedListId = null;
      this.persons = [];
    } else {
      this.selectedListId = id;
      const list = this.lists.find(l => l.id === id);
      this.persons = list ? list.persons : [];
    }
  }


  // Soumission du formulaire
  submitPerson() {
    if (this.selectedListId) {
      const selectedList = this.lists.find(l => l.id === this.selectedListId);
      if (selectedList) {
        const newPerson = {
          ...this.formPerson,
          id: crypto.randomUUID()  // Ajout d’un ID unique
        };

        selectedList.persons.push(newPerson);
        this.listService.updateList(selectedList.id, selectedList.name, selectedList.persons);

        this.formPerson = {
          lastName: '',
          gender: '',
          frenchLevel: '',
          isFormerDwwm: false,
          technicalLevel: '',
          profile: '',
          age: null
        };
      }
    }
  }


deletePerson(personId: string) {
  if (!this.selectedListId) return;
  const list = this.lists.find(l => l.id === this.selectedListId);
  if (!list) return;

  list.persons = list.persons.filter(p => p.id !== personId);
  this.listService.updateList(list.id, list.name, list.persons);
  this.persons = list.persons;
}


  // Récupérer la liste actuellement sélectionnée
  getSelectedList(): List | undefined {
    return this.lists.find(l => l.id === this.selectedListId!);
  }

  // Edition d’une personne (à implémenter selon besoin)
  edit(person: any) {
    this.isEditMode = true;
    this.formPerson = { ...person };
  }

  // Annuler l’édition ou le formulaire
  cancelPersonForm() {
    this.resetForm();
  }

  // Réinitialiser le formulaire
  private resetForm() {
    this.formPerson = {
      lastName: '',
      gender: '',
      frenchLevel: '',
      isFormerDwwm: false,
      technicalLevel: '',
      profile: '',
      age: null,
    };
    this.isEditMode = false;
  }

  // Navigation vers le générateur de groupes
  goToGroupGenerator() {
    this.router.navigate(['/group-generator']);
  }
}
