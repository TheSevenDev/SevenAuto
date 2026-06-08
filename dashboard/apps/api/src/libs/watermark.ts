export type TextWaterMarkProps = {
  dominantBaseline: 'middle' | 'auto' | 'hanging';
  textAnchor: 'middle' | 'start' | 'end';
  x: string;
  y: string;
};
export type ImageWaterMarkProps = {
  top: number;
  left: number;
};
export type WatermarkType = 'image' | 'text';
export type WaterMarkPositions =
  | 'topLeft'
  | 'topRight'
  | 'center'
  | 'bottomLeft'
  | 'bottomRight';
export const TextWaterMarkPositionsDetail = {
  topLeft: {
    dominantBaseline: 'middle',
    textAnchor: 'start',
    x: '1%',
    y: '25',
  } as TextWaterMarkProps,
  topRight: {
    dominantBaseline: 'hanging',
    textAnchor: 'end',
    x: '99%',
    y: '25',
  } as TextWaterMarkProps,
  center: {
    dominantBaseline: 'middle',
    textAnchor: 'middle',
    x: '50%',
    y: '50%',
  } as TextWaterMarkProps,
  bottomLeft: {
    dominantBaseline: 'auto',
    textAnchor: 'start',
    x: '1%',
    y: '99%',
  } as TextWaterMarkProps,
  bottomRight: {
    dominantBaseline: 'auto',
    textAnchor: 'end',
    x: '99%',
    y: '99%',
  } as TextWaterMarkProps,
};

export interface IWaterMark {
  file: Express.Multer.File;
  type: WatermarkType;
  position: WaterMarkPositions;
  value: string;
}

export const genTextSVG = (
  width: number,
  height: number,
  text: string,
  position: TextWaterMarkProps,
): Buffer => {
  const svgImage = `
    <svg width="${width}" height="${height}">
      <style>
      .title { 
          fill: #fff000; 
          font-size: 30; 
          font-weight: bold; 
          dominant-baseline: ${position.dominantBaseline};
          text-anchor: ${position.textAnchor}
      }
      </style>
      <text 
          class="title"
          x="${position.x}" 
          y="${position.y}"
      >${text}</text>
    </svg>
    `;
  return Buffer.from(svgImage);
};

export const calculateImageWaterMarkPosition = (
  targetWidth: number,
  targetHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
  position: WaterMarkPositions,
): ImageWaterMarkProps => {
  switch (position) {
    case 'topLeft':
      return {
        left: 5,
        top: 5,
      };
    case 'topRight':
      return {
        left: targetWidth - 5 - watermarkWidth,
        top: 5,
      };
    case 'center':
      return {
        left: Math.floor(targetWidth / 2 - watermarkWidth / 2),
        top: Math.floor(targetHeight / 2 - watermarkHeight / 2),
      };
    case 'bottomLeft':
      return {
        left: 5,
        top: targetHeight - 5 - watermarkHeight,
      };
    case 'bottomRight':
    default:
      return {
        left: targetWidth - 5 - watermarkWidth,
        top: targetHeight - 5 - watermarkHeight,
      };
  }
};
