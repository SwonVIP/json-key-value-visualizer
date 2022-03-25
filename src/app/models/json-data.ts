export interface DataContainer {
  [key: string]: DataItem | undefined;
}

export interface DataItem {
  [key: number]: string;
}
