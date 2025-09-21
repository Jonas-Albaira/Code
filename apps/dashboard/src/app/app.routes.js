export const routes = [
    { path: '', pathMatch: 'full', redirectTo: 'tasks' },
    { path: 'tasks', loadComponent: () => import('./tasks/tasks-page.component').then(m => m.TasksPageComponent) },
    { path: 'audit', loadComponent: () => import('./audit/audit-page.component').then(m => m.AuditPageComponent) },
    { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
    { path: '**', redirectTo: 'tasks' },
];
//# sourceMappingURL=app.routes.js.map