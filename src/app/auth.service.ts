import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

type LoginResponse = {
  token: string;
};

type AuthRequest = {
  username: string;
  password: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageKey = 'jwt_token';
  private readonly tokenState = signal<string | null>(localStorage.getItem(this.tokenStorageKey));

  readonly token = computed(() => this.tokenState());
  readonly isAuthenticated = computed(() => this.tokenState() !== null);

  login(name: string, password: string): Observable<LoginResponse> {
    const body: AuthRequest = {
      username: name,
      password
    };

    return this.http.post<LoginResponse>('https://localhost:7006/api/account/login', body).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenStorageKey, response.token);
        this.tokenState.set(response.token);
      })
    );
  }

  register(name: string, password: string): Observable<LoginResponse> {
    const body: AuthRequest = {
      username: name,
      password
    };

    return this.http.post<LoginResponse>('https://localhost:7105/api/accounts/register', body).pipe(
      tap((response) => {
        console.log('success:', response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    this.tokenState.set(null);
  }
}