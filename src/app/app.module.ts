import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { GroupGeneratorComponent } from './pages/group-generator/group-generator.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ListsComponent } from './pages/lists/lists.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // 'full' ici doit être littéral, pas une variable
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'lists', component: ListsComponent },
  { path: 'group-generator', component: GroupGeneratorComponent }, // <-- ajoute ça
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListsComponent,
    GroupGeneratorComponent,
    HomeComponent,
    RegisterComponent
  ],

  imports: [
    BrowserModule,  // contient CommonModule, mais parfois il faut expliciter si problème
    CommonModule,   // <-- ajoute-le explicitement
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
