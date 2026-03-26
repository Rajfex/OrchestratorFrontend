import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type TaskItem = {
  id: string;
  name: string;
  inputData: string;
  outputData: string;
  taskStatusId: number;
  robotId: string;
};

type RobotsInfo = {
  id: number;
  name: string;
  apiKey: string;
  status: string;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tasks implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7028/api/tasks/all';

  readonly page = signal(1);
  private readonly allTasks = signal<TaskItem[]>([]);
  
  readonly robots = httpResource<RobotsInfo[]>(() => 'https://localhost:7028/api/robots');

  readonly TaskNameFilter = signal('');
  readonly withRobotFilter = signal('0');

  handleRobotFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.withRobotFilter.set(selectedValue);
  }

  readonly tasks = computed(() => {
    const pageSize = 10;
    const start = (this.page() - 1) * pageSize;
    if(this.TaskNameFilter() == "" && this.withRobotFilter() == "0") {
      return this.allTasks().slice(start, start + pageSize);
    } else if(this.TaskNameFilter() != "" && this.withRobotFilter() == "0") {
      return this.allTasks().filter(task => task.name.toLowerCase().includes(this.TaskNameFilter().toLowerCase())).slice(start, start + pageSize);
    } else if(this.TaskNameFilter() == "" && this.withRobotFilter() != "0") {
      return this.allTasks().filter(task => task.robotId === this.withRobotFilter()).slice(start, start + pageSize);
    } else {
      return this.allTasks().filter(task => task.name.toLowerCase().includes(this.TaskNameFilter().toLowerCase()) && task.robotId === this.withRobotFilter()).slice(start, start + pageSize);
    }
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