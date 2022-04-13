import { Component } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, Subject, tap } from 'rxjs';
import { DataContainer, DataItemValueData } from './models/json-data';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'key-value-visualizer';
  data: Subject<DataContainer> = new Subject<DataContainer>();
  resultDataValue: DataContainer = {};
  displayData: any[] = [];
  groupIndex: number = 0;
  groupKey: string = '';
  flatData: any;

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
      delete this.resultDataValue[parentKey].ProductMap![itemKey];
      if (Object.entries(this.resultDataValue[parentKey].ProductMap as object).length === 0) {
        this.removeGroupByKey(parentKey);
      }
    }
  }

  initateDownload() {
    if (this.resultDataValue) {
      // flatten response to not include TagSource and ProductMap
      let downloadData: any = {};
      Object.keys(this.resultDataValue).forEach((key) => {
        if (typeof this.resultDataValue[key].ProductMap === 'object' && this.resultDataValue[key].ProductMap) {
          Object.keys(this.resultDataValue[key].ProductMap).forEach((entry: any) => {
            downloadData[key] = this.resultDataValue[key];
            downloadData[key][entry] = this.resultDataValue[key].ProductMap[entry];
          });
        }
        delete downloadData[key].ProductMap;
        delete downloadData[key].TagSource;
      });
      saveAs(
        new Blob([JSON.stringify(downloadData)], { type: 'application/json;charset=utf-8' }),
        'curated-groups.json'
      );
    }
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

  onChange(event: any) {
    var fileReader = new FileReader();
    fileReader.onload = () => {
      this.data.next(JSON.parse(fileReader.result as string));
    };
    fileReader.readAsText(event.target.files[0] || '');
  }
}
