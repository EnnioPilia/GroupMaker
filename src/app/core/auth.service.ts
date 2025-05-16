import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: User | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>('assets/data/users.json').pipe(
      tap(users => console.log('UTILISATEURS CHARGÉS:', users)), // 👈 debug
      map(users => {
        const user = users.find(u =>
          u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
          u.password === password.trim()
        );

        if (!user) {
          throw new Error('Identifiants incorrects');
        }

        this.loggedInUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }),
      catchError(err => {
        console.error('Erreur de login:', err.message);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.loggedInUser = null;
    localStorage.removeItem('user');
  }

  getUser(): User | null {
    if (this.loggedInUser) return this.loggedInUser;
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
