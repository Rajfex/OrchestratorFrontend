import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';

type Log = {
  id: string;
  taskId: string;
  message: string;
  logTypeId: number;
  created: string;
}

@Component({
  selector: 'app-logs-list',
  imports: [CommonModule],
  templateUrl: './logs-list.html',
  styleUrls: ['./logs-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsList {
  page = signal(1);
  sortDirection = signal<'desc' | 'asc'>('desc');

  readonly logsResponse = httpResource<Log[]>(() => `https://localhost:7028/api/logs/${this.page()}`);
  readonly sortedLogs = computed(() => {
  const logs = this.logsResponse.value() ?? [];
  const direction = this.sortDirection();

  return [...logs].sort((a, b) => {
      const timeA = new Date(a.created).getTime();
      const timeB = new Date(b.created).getTime();
      return direction === 'desc' ? timeB - timeA : timeA - timeB;
    });
  });

  prev(): void {
    if (this.page() > 1) {
      this.page.update((value) => value - 1);
    }
  }

  next(): void {
    this.page.update((value) => value + 1);
  }

  toggleDateSort(): void {
    this.sortDirection.update((value) => (value === 'desc' ? 'asc' : 'desc'));
  }
}