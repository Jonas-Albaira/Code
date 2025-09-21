import { Routes } from '@angular/router';
import { TaskListComponent } from './tasks/task-list/task-list.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent }, // 👈 homepage shows TaskList
  { path: 'tasks', loadComponent: () => import('./tasks/tasks-page.component').then(m => m.TasksPageComponent) },
  { path: 'audit', loadComponent: () => import('./audit/audit-page.component').then(m => m.AuditPageComponent) },
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: '**', redirectTo: '' }
];
