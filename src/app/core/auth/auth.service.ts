import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay, of, tap, throwError } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto, User } from './auth.model';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(null);

  constructor() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (token && user) {
      try {
        this.currentUser.set(JSON.parse(user) as User);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      return throwError(() => new Error('ایمیل و رمز عبور الزامی است.'));
    }

    const response: AuthResponse = {
      user: {
        id: crypto.randomUUID(),
        email: credentials.email,
        fullName: credentials.email.split('@')[0] ?? '',
      },
      token: `mock-token-${Date.now()}`,
    };

    return of(response).pipe(
      delay(500),
      tap((result) => this.persistSession(result)),
    );
  }

  register(data: RegisterDto): Observable<AuthResponse> {
    if (!data.fullName.trim() || !data.email.trim() || !data.password.trim()) {
      return throwError(() => new Error('تکمیل تمام فیلدها الزامی است.'));
    }

    const response: AuthResponse = {
      user: {
        id: crypto.randomUUID(),
        email: data.email,
        fullName: data.fullName,
      },
      token: `mock-token-${Date.now()}`,
    };

    return of(response).pipe(
      delay(500),
      tap((result) => this.persistSession(result)),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    void this.router.navigate(['/login']);
  }

  private persistSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }
}
