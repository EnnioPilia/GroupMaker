import { Component, OnInit } from '@angular/core';
import { ListService, List } from '../../core/list.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ListsComponent implements OnInit {

  // Listes existantes
  lists: List[] = [];
  newListName: string = '';
  errorMessage: string = '';

  // Gestion de la sélection et du formulaire de personnes
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
  persons: any[] = [];

  constructor(private listService: ListService, private router: Router) {}

  ngOnInit() {
    this.loadLists();
  }

  // Chargement des listes
  loadLists() {
    this.lists = this.listService.getLists();
  }

  // Création d'une nouvelle liste
  createList() {
    const name = this.newListName.trim();

    if (name === "") {
      this.errorMessage = 'Veuilliez entrer un nom de liste';
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

  // Navigation vers les détails d'une liste
  goToListDetails(listId: string) {
    this.router.navigate(['/lists', listId]);
  }

  // Sélection / désélection d'une liste
  selectList(id: string) {
    this.selectedListId = this.selectedListId === id ? null : id;
  }

  // Soumission du formulaire de personne
  submitPerson() {
    if (this.isEditMode) {
      // Modifier une personne existante (à implémenter selon ID ou index)
    } else {
      this.persons.push({ ...this.formPerson });
    }
    this.resetForm();
  }

  // Mise à jour d'une personne existante
  edit(person: any) {
    this.isEditMode = true;
    this.formPerson = { ...person };
  }

  // Suppression d'une personne
  deletePerson(personId: any) {
    this.persons = this.persons.filter(p => p.id !== personId);
  }

  // Annulation du formulaire
  cancelPersonForm() {
    this.resetForm();
  }

  // Accès au générateur de groupes
  goToGroupGenerator() {
    this.router.navigate(['/group-generator']);
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
}
