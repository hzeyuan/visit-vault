// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportImage from '../../../app/controller/image';

declare module 'egg' {
  interface IController {
    image: ExportImage;
  }
}
