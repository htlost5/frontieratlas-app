// マップ表示の初期設定とズーム・制限設定をまとめる。
const zoom = {
  max: 20.3,
  min: 18.0,
  buffer: 0.1,
};

export const mapConfig = {
  default: {
    center: [139.678405, 35.498391],
    zoom: 18.0,
    floor: 1,
  },

  zoom: {
    ...zoom,
    softMax: zoom.max - zoom.buffer,
    softMin: zoom.min + zoom.buffer,
  },

  restrict: {
    bounds: {
      ne: [139.67892, 35.498705],
      sw: [139.677889, 35.498176],
    },
  },

  displayThresholds: {
    building: 17.8,
    entrance: 19.5,
  },

  animation: {
    duration: {
      flyTo: 750,
      cameraInit: 800,
      zoomBound: 250,
    },
  },
};
