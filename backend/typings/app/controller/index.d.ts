// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportImage from '../../../app/controller/image';
import ExportOrm from '../../../app/controller/orm';
import ExportTestResource from '../../../app/controller/testResource';

declare module 'egg' {
  interface IController {
    image: ExportImage;
    orm: ExportOrm;
    testResource: ExportTestResource;
  }
}
