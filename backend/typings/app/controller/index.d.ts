// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTestResource from '../../../app/controller/testResource';

declare module 'egg' {
  interface IController {
    testResource: ExportTestResource;
  }
}
