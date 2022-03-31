export interface DataContainer {
  [key: string]: DataItem;
}

export interface DataItem {
  [key: number]: DataItemValue;
}

export interface DataItemValue {
  title: string;
  img: string;
}
