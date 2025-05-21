import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { ListsComponent } from './pages/lists/lists.component';
import { PersonListComponent } from './pages/persons/person-list.component';
import { GroupPersonsComponent } from './pages/group-persons/group-persons.component';
import { GroupGeneratorComponent } from './pages/group-generator/group-generator.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lists', component: ListsComponent },
  { path: 'lists/:listId/persons', component: PersonListComponent },
  { path: 'group-person', component: GroupPersonsComponent },
  { path: 'group-generator', component: GroupGeneratorComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
