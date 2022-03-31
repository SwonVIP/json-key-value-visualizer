export interface DataContainer {
  [key: string]: DataItem | undefined;
}

export interface DataItem {
  [key: number]: DataItemValue;
}

export interface DataItemValue {
  title: string;
  img: string;
}
