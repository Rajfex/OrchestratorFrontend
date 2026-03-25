import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tasks implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7028/api/tasks/all';

  readonly page = signal(1);
  private readonly allTasks = signal<TaskItem[]>([]);
  
  readonly tasks = computed(() => {
    const pageSize = 10;
    const start = (this.page() - 1) * pageSize;
    return this.allTasks().slice(start, start + pageSize);
  });

  readonly hasNextPage = computed(() => {
    return this.allTasks().length > this.page() * 10;
  });

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadTasks();
  }

  refresh(): void {
    this.loadTasks();
  }

  prev(): void {
    if (this.page() > 1) {
      this.page.update((value) => value - 1);
    }
  }

  next(): void {
    if (this.hasNextPage()) {
      this.page.update((value) => value + 1);
    }
  }

  private loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<TaskItem[]>(this.apiUrl).subscribe({
      next: (response) => {
        this.allTasks.set(response ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No tasks');
        this.isLoading.set(false);
      }
    });
  }
}