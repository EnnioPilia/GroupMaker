import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ListsComponent } from './pages/lists/lists.component';
import { GroupGeneratorComponent } from './pages/group-generator/group-generator.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './auth/register/register.component';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'lists', component: ListsComponent },
  { path: 'group-generator', component: GroupGeneratorComponent },
];

// @NgModule({
//   declarations: [
//     AppComponent,
//     LoginComponent,
//     ListsComponent,
//     GroupGeneratorComponent,
//     HomeComponent,
//     RegisterComponent,
//   ],
  
//   imports: [
//     BrowserModule,
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     RouterModule.forRoot(routes),
//   ],
//   providers: [],
//   bootstrap: [AppComponent],
// })
export class AppModule {}
