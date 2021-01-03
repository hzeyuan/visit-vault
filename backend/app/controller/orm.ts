import { Controller } from 'egg';
// import {Image} from '../entity/sys/Image';

export default class OrmController extends Controller {
  public async index() {
    this.service.image.create();
  }
}
