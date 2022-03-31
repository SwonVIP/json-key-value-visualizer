import { Component } from '@angular/core';
import { distinctUntilChanged, filter, Observable, Subject, tap } from 'rxjs';
import { DataContainer } from './models/json-data';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'key-value-visualizer';
  data: Subject<DataContainer> = new Subject<DataContainer>();
  resultDataValue: DataContainer = {};
  displayData: any[] = [];
  groupIndex: number = 0;
  groupKey: string = '';
  inputError = false;
  placeholderValue = ` Paste JSON here: {
    "key": { "subkey": { "title": "", "img": "" }, "subkey2": { "title": "", "img": "" } },
    "key2": { "subkey": { "title": "", "img": "" }, "subkey3": { "title": "", "img": "" } }
  }`;

  constructor() {}

  ngOnInit(): void {
    // TODO Unsubscribe
    this.data
      .asObservable()
      .pipe(
        distinctUntilChanged(),
        filter((dataVal) => dataVal != null),
        tap((data) => {
          this.groupIndex = 0;
          this.displayData = Object.values(data);
          this.resultDataValue = { ...data };
          this.groupKey = Object.keys(this.resultDataValue)[this.groupIndex];
        })
      )
      .subscribe();
  }

  handleDataInputChange(event: any) {
    try {
      this.inputError = false;
      this.data.next(JSON.parse(event?.target.value));
    } catch (e) {
      this.inputError = true;
    }
  }

  removeGroupByKey(key: string) {
    if (this.resultDataValue) {
      delete this.resultDataValue[key];
    }
    if (this.groupIndex + 1 === this.displayData.length) {
      this.groupIndex--;
    }
    this.displayData = Object.values(this.resultDataValue);
    this.groupKey = Object.keys(this.resultDataValue)[this.groupIndex];
  }

  removeItemByKey(keys: any) {
    if (this.resultDataValue) {
      let parentKey, itemKey;
      ({ parentKey, itemKey } = keys);
      delete this.resultDataValue[parentKey]![itemKey];
      if (Object.entries(this.resultDataValue[parentKey] as object).length === 0) {
        this.removeGroupByKey(parentKey);
      }
    }
  }

  initateDownload() {
    // saveAs(
    //   new Blob([JSON.stringify(this.resultDataValue)], { type: 'application/json;charset=utf-8' }),
    //   'curated-groups.json'
    // );
    console.log(JSON.stringify(this.resultDataValue));
  }

  incrementGroupNavigation() {
    this.groupIndex++;
    this.groupKey = Object.keys(this.resultDataValue)[this.groupIndex];
  }
  decrementGroupNavigation() {
    this.groupIndex--;
    this.groupKey = Object.keys(this.resultDataValue)[this.groupIndex];
  }

  isValid(obj: DataContainer) {
    return Object.keys(obj).length > 0;
  }
}
