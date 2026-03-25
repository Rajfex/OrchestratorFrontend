import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask {
  constructor(private http: HttpClient) {}

  activeTab: 'flash' | 'stocks' = 'flash';

  fsCountry: string = '';
  fsLeague: string = '';
  fsName: string = '';
  flashscoreList: { country: string; leagueName: string }[] = [];

  stType: string = 'Akcje';
  stPeriod: string = '';
  stName: string = '';
  stTaskName: string = '';
  stocksList: { type: string; period: string; name: string }[] = [];


  toggleFlashscore(): void {
    this.activeTab = 'flash';
  }

  toggleStocks(): void {
    this.activeTab = 'stocks';
  }


  addFlash(): void {
    if (!this.fsCountry || !this.fsLeague || !this.fsName) return;

    this.flashscoreList.push({
      country: this.fsCountry,
      leagueName: this.fsLeague,
    });

    this.fsCountry = '';
    this.fsLeague = '';
  }

  addStock(): void {
    if (!this.stName || !this.stPeriod || !this.stTaskName) return;

    this.stocksList.push({
      type: this.stType,
      period: this.stPeriod,
      name: this.stName,
    });

    this.stName = '';
    this.stPeriod = '';
  }


  submitFlash(): void {
    const payload = {
      inputData: {
        FootballLeagueInfo: this.flashscoreList,
      },
      name: this.fsName,
    };

    this.http.post('https://localhost:7028/api/tasks/create', payload)
      .subscribe({
        next: (res) => {
          this.flashscoreList = [];
        },
        error: (err) => console.error(err),
      });
  }

  submitStocks(): void {
    const payload = {
      inputData: {
        StocksInfo: this.stocksList,
      },
      name: this.stTaskName,
    };

    this.http.post('https://localhost:7028/api/tasks/create', payload)
      .subscribe({
        next: (res) => {
          this.stocksList = [];
        },
        error: (err) => console.error(err),
      });
  }
}