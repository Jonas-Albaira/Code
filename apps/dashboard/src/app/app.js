import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
let AppComponent = class AppComponent {
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [RouterModule],
        template: `
  <header class="topbar">
    <h1>RBAC Tasks Dashboard</h1>
    <nav>
      <a routerLink="/tasks" routerLinkActive="active">Tasks</a>
      <a routerLink="/audit" routerLinkActive="active">Audit Log</a>
      <a routerLink="/login" routerLinkActive="active">Login</a>
    </nav>
  </header>
  <main class="container">
    <router-outlet />
  </main>
  `,
        styles: [`
    .topbar { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid #ddd; }
    nav a { margin-right:12px; text-decoration:none; }
    nav a.active { font-weight:600; }
    .container { padding: 16px; }
  `]
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.js.map