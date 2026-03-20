import { NgClass } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';

type RobotsInfo = {
  id: number;
  name: string;
  apiKey: string;
  status: string;
}

@Component({
  selector: 'app-robots-panel',
  imports: [NgClass],
  templateUrl: './robots-panel.html',
  styleUrl: './robots-panel.css',
})
export class RobotsPanel {
    readonly truckRoutesResource = httpResource<RobotsInfo[]>(() => 'https://localhost:7028/api/robots');
}
