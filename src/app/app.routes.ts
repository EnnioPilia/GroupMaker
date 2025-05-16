import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { ListsComponent } from './pages/lists/lists.component';
import { PersonListComponent } from './pages/persons/person-list.component';
import { GroupPersonsComponent } from './pages/group-persons/group-persons.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'lists', component: ListsComponent },
  { path: 'lists/:listId/persons', component: PersonListComponent },
  { path: 'group-person', component: GroupPersonsComponent }
];
