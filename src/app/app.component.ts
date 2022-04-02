import { Component } from '@angular/core';
import { distinctUntilChanged, filter, Subject, tap } from 'rxjs';
import { DataContainer } from './models/json-data';
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
  placeholderValue = ` Paste JSON here: {
    "key": { "subkey": { "title": "", "img": "" }, "subkey2": { "title": "", "img": "" } },
    "key2": { "subkey": { "title": "", "img": "" }, "subkey3": { "title": "", "img": "" } }
  }`;

  staticValueForTesting = `{"FOLIE": {
    "100054214": {
      "title": "Cucina \u0026 Tavola Schondecke",
      "img": "https://image.migros.ch/original/f98cd59967fccaba3d93350fa16db64a827469cb/cucina-tavola-schondecke.jpg"
    },
    "100058484": {
      "title": "Cucina \u0026 Tavola Tischdecke",
      "img": "https://image.migros.ch/original/2dfa1df55ac9f39f182f3ea40a9d98b63d97a5e0/cucina-tavola-tischdecke.jpg"
    },
    "100058485": {
      "title": "Cucina \u0026 Tavola Tischdecke",
      "img": "https://image.migros.ch/original/350e48fc6d2cf37da828b385dc098239578128d6/cucina-tavola-tischdecke.jpg"
    },
    "100058486": {
      "title": "Cucina \u0026 Tavola Tischdecke",
      "img": "https://image.migros.ch/original/ccf9284c57275e7b7fe6057836c2e6bcfb24a24a/cucina-tavola-tischdecke.jpg"
    },
    "100058487": {
      "title": "Cucina \u0026 Tavola Tischdecke",
      "img": "https://image.migros.ch/original/f11dc7c24c118bbe9ee09020bece929c9cc6fb93/cucina-tavola-tischdecke.jpg"
    },
    "100058498": {
      "title": "Cucina \u0026 Tavola Tischdecke Plastik",
      "img": "https://image.migros.ch/original/bc56f962fd344d43e0d2a1bd5ad9762ae2a1e9c1/cucina-tavola-tischdecke-plastik.jpg"
    }
  },
  "FOLIEN/BEUTEL": {
    "100054548": {
      "title": "Tangan N11 Frischhaltefolie",
      "img": "https://image.migros.ch/original/1f9bb4833b6af2ece2ea7944ba579451be9f0dec/tangan-n11-frischhaltefolie.jpg"
    },
    "100054691": {
      "title": "Tangan Folien Trio",
      "img": "https://image.migros.ch/original/9814f41af7e3836b6ced94088f3799af7a863093/tangan-folien-trio.jpg"
    },
    "100054693": {
      "title": "Tangan N°24 Zip Beutel",
      "img": "https://image.migros.ch/original/0ee568bc83e4401532a7bca9ca50ac36bcc9f7e9/tangan-n24-zip-beutel.jpg"
    },
    "100054694": {
      "title": "Tangan N°20 Sandwichbeutel",
      "img": "https://image.migros.ch/original/47b4527919a61f7596528582ee77016f072fca05/tangan-n20-sandwichbeutel.jpg"
    },
    "100058713": {
      "title": "Tangan",
      "img": "https://image.migros.ch/original/4e29051106863b1256e078bd1e17578adfd8b6ac/tangan.jpg"
    }
  },
  "FOND": {
    "100052543": {
      "title": "Kalbs-Fond 150g",
      "img": "https://image.migros.ch/original/e5e1039512b20cef44e953f23c524a3ebc3e3267/kalbs-fond-150g.jpg"
    }
  }}`;

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
    this.data.next(JSON.parse(this.staticValueForTesting));
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
    if (this.resultDataValue) {
      saveAs(
        new Blob([JSON.stringify(this.resultDataValue)], { type: 'application/json;charset=utf-8' }),
        'curated-groups.json'
      );
      // TODO if mapping not changed in backend
      // flatten response to not include nested title, img object anymore
      // let downloadData: any = {};
      // Object.keys(this.resultDataValue).forEach((key) => {
      //   if (typeof this.resultDataValue[key] === 'object' && this.resultDataValue[key]) {
      //     Object.keys(this.resultDataValue[key]).forEach((entry: any) => {
      //       downloadData[key] = this.resultDataValue[key];
      //       downloadData[key][entry] = this.resultDataValue[key][entry].title;
      //     });
      //   }
      // });
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
