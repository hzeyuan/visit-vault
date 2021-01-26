import { Controller } from 'egg';
import * as fs from 'fs';
import * as path from 'path';

export default class ImageController extends Controller {
  public async image() {
    const image = await this.service.image.getById(this.ctx.params.image);
    this.logger.info(`1.获取到图片 ==>${image!.name}`);
    // 数据库中没有找到记录
    if (!image) this.ctx.redirect('/broken');
    // 获取绝对路径
    const resolved = path.resolve(`${image!.path}`);
    // 存在图片资源 =>跳转到图片资源
    if (!fs.existsSync(resolved)) this.ctx.redirect('/broken');
    this.ctx.redirect(`/${image!.path}`);

  }
  public async imageThumbnail() {
    const image = await this.service.image.getById(this.ctx.params.image);
    this.logger.info(`1.获取到图片 ==>${image!.name}`);
    // 数据库中没有找到记录
    if (!image) this.ctx.redirect('/broken');
    const resolved = path.resolve(`${image!.thumbPath}`);
    if (fs.existsSync(resolved)) this.ctx.redirect(`/${image!.thumbPath}`);
    // 不存在缩略图资源 =>跳转到图片资源
    this.ctx.redirect(`/${image!.path}`);
  }
}

