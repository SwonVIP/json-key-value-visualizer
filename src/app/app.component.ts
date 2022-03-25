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
  imgPath: string = '';
  inputError = false;

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
          // TODO Switch Map to enrich object with image path
          this.loadImages();
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
    saveAs(
      new Blob([JSON.stringify(this.resultDataValue)], { type: 'application/json;charset=utf-8' }),
      'curated-groups.json'
    );
  }

  incrementGroupNavigation() {
    // TODO async image loading?
    this.loadImages();
    this.groupIndex++;
    this.groupKey = Object.keys(this.resultDataValue)[this.groupIndex];
  }
  decrementGroupNavigation() {
    // TODO async image loading?
    this.loadImages();
    this.groupIndex--;
    this.groupKey = Object.keys(this.resultDataValue)[this.groupIndex];
  }

  moveToNextCategory(i: number) {}

  // TODO Preparation for when we have the unified format + image CDN available
  // Input to component map of id: image when ready
  loadImages() {
    const pids = Object.keys(this.resultDataValue[this.groupKey] as object);
  }

  saveImageConfig(event: any) {
    this.imgPath = event.target.value;
  }
  isValid(obj: DataContainer) {
    return Object.keys(obj).length > 0;
  }
}
