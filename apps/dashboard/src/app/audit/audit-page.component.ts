import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-audit-page',
  imports: [CommonModule],
  template: `
    <h2>Audit Log</h2>
    <p *ngIf="!auth.isAdminOrOwner()">You must be an Admin or Owner to view this page.</p>
    <pre *ngIf="auth.isAdminOrOwner()">{{ logs() }}</pre>
  `
})
export class AuditPageComponent implements OnInit {
  logs = signal('');
  constructor(private http: HttpClient, public auth: AuthService) {}
  ngOnInit() {
    if (this.auth.isAdminOrOwner()) {
      this.http.get(`${environment.apiUrl}/audit-log`, { responseType: 'text' })
        .subscribe(txt => this.logs.set(txt as any));
    }
  }
}
