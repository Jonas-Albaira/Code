import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // GET all tasks
  list(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // POST create task
  create(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // PUT update task
  update(id: string | number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // DELETE remove task
  remove(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
