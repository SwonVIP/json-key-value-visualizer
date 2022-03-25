import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-visualization-item',
  templateUrl: './data-visualization-item.component.html',
  styleUrls: ['./data-visualization-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataVisualizationItemComponent implements OnInit {
  // TODO Might wanna introduce redux store for more convinent state management!
  @Input() key: string = '';
  @Input() value: string = '';
  @Output() dataChangeItem: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  discardItemByKey(key: string) {
    this.dataChangeItem.emit(key);
  }
}
