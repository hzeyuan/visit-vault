import { Controller } from 'egg';
import * as fs from 'fs';
import * as path from 'path';

export default class ImageController extends Controller {
  public async image() {
    console.log('image', this.ctx.params);
    const image = await this.service.image.getById(this.ctx.params.image);
    if (image && image.path) {
      const resolved = path.resolve(`${image.path}`);
      if (!fs.existsSync(resolved)) this.ctx.redirect('/broken');
      else {
        this.ctx.redirect(`/${image.path}`);
      }
    } else {
      this.ctx.redirect('/broken');
    }
  }
  public async imageThumbnail() {
    const image = await this.service.image.getById(this.ctx.params.image);
    if (image && image.thumbPath) {
      const resolved = path.resolve(`${image.thumbPath}`);
      this.logger.info(`get image ==> ${image.thumbPath}`);
      if (!fs.existsSync(resolved)) {
        this.ctx.redirect('/broken');
      } else {
        this.ctx.redirect(`/${image.thumbPath}`);
      }
    } else if (image) {
      const config = {
        auth: {
          password: '123',
        },
      };
      this.logger.info(`${this.ctx.params.image}'s thumbnail does not exist (yet)`);
      this.ctx.redirect(`/media/image/${image._id.toString()}?password=${config.auth.password}`);
    } else {
      this.ctx.redirect('/broken');
    }
  }
}
