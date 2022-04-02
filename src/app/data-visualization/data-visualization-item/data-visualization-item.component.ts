import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { DataItemValue } from 'src/app/models/json-data';

@Component({
  selector: 'app-data-visualization-item',
  templateUrl: './data-visualization-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataVisualizationItemComponent implements OnInit {
  // TODO Might wanna introduce redux store for more convinent state management!
  @Input() key: string = '';
  @Input() value: DataItemValue = { title: '', img: '' };
  @Output() dataChangeItem: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  discardItemByKey(key: string) {
    this.dataChangeItem.emit(key);
  }
}
