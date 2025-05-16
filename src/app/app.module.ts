import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ListsComponent } from './pages/lists/lists.component';
// tes autres composants ici

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // 'full' ici doit être littéral, pas une variable
  { path: 'login', component: LoginComponent },
  { path: 'lists', component: ListsComponent },
  // autres routes ...
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListsComponent,
    // autres composants ici
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),  // <-- ici dans imports du module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
