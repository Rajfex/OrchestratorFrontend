import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotsPanel } from './robots-panel';

describe('RobotsPanel', () => {
  let component: RobotsPanel;
  let fixture: ComponentFixture<RobotsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobotsPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(RobotsPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
