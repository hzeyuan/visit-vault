import { Service } from 'egg';
import Image from '../entity/sys/Image'
import { mapAsync } from '../utils/async';
export default class ImageService extends Service {
  public async getById(id: string): Promise<Image | undefined> {
    const image = await this.ctx.repo.Image.manager.findOne(Image, { _id: id })
    // const image = await this.ctx.repo.Image.createQueryBuilder('image').where('image._id = :id', { id }).getOne();
    return image;
  }
  public async create(image: Image){

    console.log('create ---')

    // this.ctx.ormManage
    // {
    //   _id: '1',
    //   addedOn: 'addedOn',
    //   favorite: true,
    //   customFields: '',
    //   name: '图片',
    //   path: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa0.att.hudong.com%2F52%2F62%2F31300542679117141195629117826.jpg&refer=http%3A%2F%2Fa0.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1611576383&t=63182d5eb71da0dc476244c3a9ceb76e',
    //   actors: '',
    //   thumbPath: '',
    //   scene: '',
    //   bookmark: 1,
    //   rating: 5,
    //   meta: '',
    //   studio: '',
    //   hash: '',
    //   color: '',
    // }
    
    const img = await this.ctx.repo.Image.manager.create(Image, image);
    return this.ctx.repo.Image.manager.save(img);
    // const res = await this.ctx.repo.Image.createQueryBuilder('image').insert().into(Image)
    //   .values(image as Image).execute();
  }
  public async all() {
    return await this.ctx.repo.Image.manager.find(Image);
    // return await this.ctx.repo.Image.createQueryBuilder('image').getManyAndCount();
  }
  public async count() {
    return await this.ctx.repo.Image.manager.count(Image);
  }
  public async remove(id: string) {
    await this.ctx.repo.Image.manager.delete(Image, { _id: id });
    return true
    // return await this.ctx.repo.Image.createQueryBuilder('image').where('image._id = :id', { id }).delete();
  }
  public async removes(ids: string[]) {
    await mapAsync(ids, async (id: string) => {
      await this.ctx.repo.Image.manager.delete(Image, { _id: id });
      // await this.ctx.repo.Image.createQueryBuilder('image').where('image._id = :id', { id }).delete().execute();
    });
  }
}
