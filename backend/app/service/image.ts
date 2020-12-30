import { Service } from 'egg';
import Image from '../entity/sys/Image';

export default class ImageService extends Service {
  public async getById(id: string): Promise<Image> {
    const res:Image = await this.ctx.repo.Image.createQueryBuilder('image').where('image._id = :id', { id }).execute();
    return res;
  }
  public async create() {
    const res = await this.ctx.repo.Image.createQueryBuilder('image').insert().into(Image)
      .values({})
      .execute();
    this.logger.debug('res', res);
  }
}
