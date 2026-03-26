import { NgClass } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';

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
};

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterLink, FormsModule, NgClass],
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

  readonly DisplayType = signal<'list' | 'tiled'>('tiled');
  readonly TaskNameFilter = signal('');
  readonly withRobotFilter = signal('0');

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly filteredTasks = computed(() => {
    const nameFilter = this.TaskNameFilter().toLowerCase();
    const robotFilter = this.withRobotFilter();

    return this.allTasks().filter(task => {
      const matchesName = nameFilter === "" || task.name.toLowerCase().includes(nameFilter);
      const matchesRobot = robotFilter === "0" || task.robotId === robotFilter;
      return matchesName && matchesRobot;
    });
  });

  readonly tasks = computed(() => {
    const pageSize = 9;
    const start = (this.page() - 1) * pageSize;
    return this.filteredTasks().slice(start, start + pageSize);
  });

  readonly hasNextPage = computed(() => {
    return this.filteredTasks().length > this.page() * 9;
  });

  ngOnInit(): void {
    this.loadTasks();
  }


  handleRobotFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.withRobotFilter.set(selectElement.value);
    this.page.set(1);
  }

  exportToExcel(): void {
    const data = this.filteredTasks();
    if (data.length === 0) return;

    const exportData = data.map(task => {
      const robot = this.robots.value()?.find(r => r.id.toString() === task.robotId);
      return {
        'ID': task.id,
        'Nazwa Zadania': task.name,
        'Robot': robot ? robot.name : 'Nieprzypisany',
        'Status ID': task.taskStatusId,
        'Dane Wejściowe': task.inputData,
        'Dane Wyjściowe': task.outputData
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Zadania');

    const fileName = `Tasks_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<TaskItem[]>(this.apiUrl).subscribe({
      next: (response) => {
        this.allTasks.set(response ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Błąd podczas ładowania zadań');
        this.isLoading.set(false);
      }
    });
  }

  refresh(): void {
    this.loadTasks();
  }

  prev(): void {
    if (this.page() > 1) this.page.update(v => v - 1);
  }

  next(): void {
    if (this.hasNextPage()) this.page.update(v => v + 1);
  }
}