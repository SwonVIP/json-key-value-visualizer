import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataVisualizationItemComponent } from './data-visualization-item.component';

describe('DataVisualizationItemComponent', () => {
  let component: DataVisualizationItemComponent;
  let fixture: ComponentFixture<DataVisualizationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataVisualizationItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataVisualizationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
