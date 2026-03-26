import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export type TaskItem = {
  id: string;
  name: string;
  inputData: string;
  outputData: string;
  taskStatusId: number;
  robotId: string;
};

@Component({
  selector: 'app-task-details',
  imports: [],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetails{
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7028/api/tasks/all';

  readonly task = signal<TaskItem | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly inputDataPretty = computed(() => this.formatJson(this.task()?.inputData));
  readonly outputDataPretty = computed(() => this.formatJson(this.task()?.outputData));

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('No Tasks');
      return;
    }

    this.loadTask(id);
  }

  private loadTask(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<TaskItem[]>(this.apiUrl).subscribe({
      next: (response) => {
        const tasks = response ?? [];
        const foundTask = tasks.find((item) => item.id === id) ?? null;

        if (!foundTask) {
          this.errorMessage.set('No Tasks');
        }

        this.task.set(foundTask);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No Tasks');
        this.isLoading.set(false);
      }
    });
  }

  private formatJson(value: string | undefined): string {
    if (!value) {
      return 'No Data';
    }

    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
}
