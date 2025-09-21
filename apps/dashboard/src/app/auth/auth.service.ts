import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);

  readonly user = computed(() => this._user());
  readonly isAdminOrOwner = computed(() => {
    const r = this._user()?.role;
    return r === 'Admin' || r === 'Owner';
  });

  constructor(private http: HttpClient) {
    const u = localStorage.getItem('user');
    if (u) this._user.set(JSON.parse(u));
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password });
  }

  setSession(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._user.set(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user.set(null);
  }
}
