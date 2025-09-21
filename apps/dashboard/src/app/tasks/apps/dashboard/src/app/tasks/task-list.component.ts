import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../../task.service';
import { Task } from '../../../../../../models/task.model';

// @ts-ignore
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // fallback mock tasks
    this.tasks = <Task[]>[
      {
        id: 1,
        title: 'Sample Task 1',
        description: 'Do something',
        status: 'pending',
        organizationId: 'org-1',
        assignedTo: 'user-1' // optional
      },
      {
        id: 2,
        title: 'Sample Task 2',
        description: 'Do something else',
        status: 'completed',
        organizationId: 'org-2'
        // assignedTo is optional
      }
    ];

    // then try to fetch from API
    this.taskService.list().subscribe((data: Task[]) => {
      this.tasks = data;
    });
  }
}
