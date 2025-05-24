import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PersonService } from '../../core/person.service';
import { Person } from '../../core/models/person.model';

@Component({
  selector: 'app-person-list',
  // standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  listId!: string;
  persons: Person[] = [];

  formPerson: Person = this.getEmptyPerson();
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.listId = params['listId'];
      this.loadPersons();
    });
  }

  loadPersons() {
    this.persons = this.personService.getPersons(this.listId);
  }

  submit() {
    if (this.isEditMode) {
      this.personService.updatePerson(this.listId, this.formPerson);
    } else {
      this.personService.addPerson(this.listId, this.formPerson);
    }
    this.formPerson = this.getEmptyPerson();
    this.isEditMode = false;
    this.loadPersons();
  }

  edit(person: Person) {
    this.formPerson = { ...person };
    this.isEditMode = true;
  }

  delete(personId: string) {
    if (confirm('Voulez-vous vraiment supprimer cette personne ?')) {
      this.personService.deletePerson(this.listId, personId);
      this.loadPersons();
    }
  }

  cancel() {
    this.formPerson = this.getEmptyPerson();
    this.isEditMode = false;
  }

  getEmptyPerson(): Person {
    return {
      id: "",
      lastName: '',
      gender: 'masculin',
      frenchLevel: 1,
      isFormerDwwm: false,
      technicalLevel: 1,
      profile: 'timide',
      age: 18,
    };
  }
}
