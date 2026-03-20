import { Component } from '@angular/core';
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
  standalone: true,        
  imports: [CommonModule],    
  templateUrl: './logs-list.html',
  styleUrls: ['./logs-list.css'],
})
export class LogsList {
  readonly logsResponse = httpResource<Log[]>(() => 'https://localhost:7028/api/logs');
}