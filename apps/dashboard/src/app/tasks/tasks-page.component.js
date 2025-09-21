import { __decorate, __metadata } from "tslib";
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './task.service';
import { AuthService } from '../auth/auth.service';
// @ts-ignore
let TasksPageComponent = class TasksPageComponent {
    constructor(api, auth) {
        this.api = api;
        this.auth = auth;
        this.tasks = signal([]);
        this.loading = signal(false);
        this.error = signal(null);
        this.query = '';
        this.statusFilter = '';
        this.form = { title: '', description: '', status: 'pending' };
        this._editing = signal(null);
        this.editing = this._editing.asReadonly();
        this.filtered = computed(() => {
            let list = this.tasks();
            if (this.query) {
                const q = this.query.toLowerCase();
                list = list.filter(t => (t.title || '').toLowerCase().includes(q));
            }
            if (this.statusFilter) {
                list = list.filter(t => t.status === this.statusFilter);
            }
            return list;
        });
    }
    ngOnInit() { this.refresh(); }
    canMutate() { return this.auth.isAdminOrOwner(); }
    refresh() {
        this.loading.set(true);
        this.api.list().subscribe({
            next: (data) => { this.tasks.set(data); this.loading.set(false); },
            error: (e) => { var _a; this.error.set(((_a = e === null || e === void 0 ? void 0 : e.error) === null || _a === void 0 ? void 0 : _a.message) || 'Failed to load'); this.loading.set(false); }
        });
    }
    getAssigneeName(t) {
        const a = t.assignedTo;
        if (!a)
            return '';
        if (typeof a === 'string')
            return a;
        return a.name || a.id || '';
    }
    startCreate() {
        var _a;
        this._editing.set({ id: '', title: '', description: '', status: 'pending', organizationId: '' });
        this.form = { title: '', description: '', status: 'pending' };
        (_a = document.querySelector('dialog')) === null || _a === void 0 ? void 0 : _a.showModal();
    }
    edit(t) {
        var _a;
        this._editing.set(t);
        this.form = { title: t.title, description: t.description, status: t.status };
        (_a = document.querySelector('dialog')) === null || _a === void 0 ? void 0 : _a.showModal();
    }
    close() { var _a; (_a = document.querySelector('dialog')) === null || _a === void 0 ? void 0 : _a.close(); }
    submit() {
        const editing = this._editing();
        if (!editing || !editing.id) {
            this.api.create(this.form).subscribe({ next: () => { this.close(); this.refresh(); } });
        }
        else {
            this.api.update(editing.id, this.form).subscribe({ next: () => { this.close(); this.refresh(); } });
        }
    }
    save(t) {
        this.api.update(t.id, { status: t.status }).subscribe();
    }
    delete(t) {
        if (!confirm(`Delete task "${t.title}"?`))
            return;
        this.api.remove(t.id).subscribe({ next: () => this.refresh() });
    }
};
TasksPageComponent = __decorate([
    Component({
        standalone: true,
        selector: 'app-tasks-page',
        imports: [CommonModule, FormsModule],
        template: `
    <section class="head">
      <h2>Tasks</h2>
      <div class="spacer"></div>
      <button *ngIf="canMutate()" (click)="startCreate()">+ New Task</button>
    </section>

    <div class="filters">
      <input placeholder="Search title..." [(ngModel)]="query" />
      <select [(ngModel)]="statusFilter">
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button (click)="refresh()">Refresh</button>
    </div>

    <table class="table" *ngIf="filtered().length; else empty">
      <thead>
      <tr>
        <th>Title</th>
        <th>Status</th>
        <th>Assignee</th>
        <th>Org</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let t of filtered()">
        <td>{{ t.title }}</td>
        <td>
          <select [disabled]="!canMutate()" [(ngModel)]="t.status" (ngModelChange)="save(t)">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </td>
        <td>{{ getAssigneeName(t) }}</td>
        <td>{{ t.organizationId }}</td>
        <td>
          <button [disabled]="!canMutate()" (click)="edit(t)">Edit</button>
          <button class="danger" [disabled]="!canMutate()" (click)="delete(t)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <ng-template #empty>
      <p>No tasks available for your role/organization.</p>
    </ng-template>

    <dialog #dlg>
      <form method="dialog" class="modal" (submit)="submit()">
        <!-- ✅ optional chaining fixes here -->
        <h3>{{ editing()?.id ? 'Edit Task' : 'Create Task' }}</h3>
        <label>Title <input [(ngModel)]="form.title" name="title" required /></label>
        <label>Description <textarea [(ngModel)]="form.description" name="description"></textarea></label>
        <label>Status
          <select [(ngModel)]="form.status" name="status">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <menu>
          <button value="cancel" type="button" (click)="close()">Cancel</button>
          <!-- ✅ optional chaining fix here -->
          <button value="default" type="submit">{{ editing()?.id ? 'Save' : 'Create' }}</button>
        </menu>
      </form>
    </dialog>
  `,
        styles: [`
    .head { display:flex; align-items:center; gap:12px; }
    .head .spacer { flex:1; }
    .filters { display:flex; gap:8px; margin:12px 0; }
    .table { width:100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #eee; padding:8px; text-align:left; }
    .danger { color:crimson; }
    dialog::backdrop { background: rgba(0,0,0,0.35); }
    .modal { display:flex; flex-direction:column; gap:8px; width:420px; }
    input, textarea, select { padding:6px 8px; }
    menu { display:flex; gap:8px; justify-content:flex-end; }
  `]
    }),
    __metadata("design:paramtypes", [TaskService, AuthService])
], TasksPageComponent);
export { TasksPageComponent };
//# sourceMappingURL=tasks-page.component.js.map