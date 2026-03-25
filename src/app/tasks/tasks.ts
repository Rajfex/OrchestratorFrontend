import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
// import { TaskItem } from '../task.model';


export type TaskItem = {
  id: string;
  name: string;
  inputData: string;
  outputData: string;
  taskStatusId: number;
  robotId: string;
};


@Component({
  selector: 'app-tasks',
  imports: [RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Tasks{
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7028/api/tasks/all';

  readonly tasks = signal<TaskItem[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadTasks();
  }

  refresh(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<TaskItem[]>(this.apiUrl).subscribe({
      next: (response) => {
        this.tasks.set(response ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No tasks');
        this.isLoading.set(false);
      }
    });
  }
}
