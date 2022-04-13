export interface DataContainer {
  [key: string]: DataItem;
}

export interface DataItem {
  TagSource: string;
  ProductMap: DataItemValue[];
}

export interface DataItemValue {
  [key: string]: DataItemValueData;
}

export interface DataItemValueData {
  title: string;
  img: string;
}
