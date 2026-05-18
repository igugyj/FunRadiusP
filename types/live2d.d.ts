declare global {
  interface Window {
    L2Dwidget?: {
      init: (config: L2DWidgetConfig) => any;
    };
    OML2D?: {
      loadOml2d: (config: OML2DConfig) => any;
    };
    live2dInitialized: boolean;
    live2dInstance: any;
  }
}

interface L2DWidgetConfig {
  model: {
    jsonPath: string;
    scale: number;
  };
  display: {
    position: "left" | "right";
    width: number;
    height: number;
    hOffset: number;
    vOffset: number;
  };
  mobile: {
    show: boolean;
    scale: number;
  };
  react: {
    opacityDefault: number;
    opacityOnHover: number;
  };
}

interface OML2DConfig {
  dockedPosition?: "left" | "right";
  models: Array<{
    path: string;
    position: [number, number];
    scale: number;
    stageStyle?: {
      height: number;
    };
  }>;
}

export {};
