import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { DataItem } from 'src/app/models/json-data';

@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataVisualizationComponent implements OnInit {
  @Input() key: string = '';
  @Input() value: DataItem | undefined;
  @Output() dataChangeGroup: EventEmitter<string> = new EventEmitter();
  @Output() dataChangeItem: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  discardGroupByKey(key: string) {
    this.dataChangeGroup.emit(key);
  }

  discardItemByKey(key: any) {
    this.dataChangeItem.emit({ parentKey: this.key, itemKey: key });
  }
}
