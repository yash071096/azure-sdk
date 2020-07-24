export interface tagSchema {
  [tagID: string]: {
    'rssi': string,
    'timeStamp': number
  }
}

export interface scannerSchema {
  [scannerID: string]: tagSchema;
}

export interface coordinatesSchema {
  'lat': number,
  'long': number
}

export interface tagDataSchema {
  [tagID: string]: {
    [scannerID: string]: {
      'rssi': string,
      'timeStamp': number,
      'coordinates': coordinatesSchema
    }
  }
}

export interface configurationDataSchema {
  [scannerID: string]: coordinatesSchema;
}
