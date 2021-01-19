import { Service } from 'egg';
import { FindManyOptions } from 'typeorm';
import Image from '../entity/sys/Image'
// import Label from '../types/label';
import { mapAsync } from '../utils/async';

const DEFAULT_PAGE_SIZE = 20;

const getPageSize = (take?: number | null): number => {
  return take || DEFAULT_PAGE_SIZE;
}


export default class ImageService extends Service {
  public async getById(id: string): Promise<Image | undefined> {
    const image = await this.ctx.repo.Image.manager.findOne(Image, { _id: id })
    return image;
  }
  public async getPage(page?: number, skip?: number, take?: number, filters = {}) {
    const pageSize = getPageSize(take);
    return await this.ctx.repo.Image.manager.find(Image, { skip: skip || Math.max(0, +(page || 0) * pageSize), take, ...filters } as FindManyOptions);
  }
  public async upsert(image: Image) {
    const img = this.ctx.repo.Image.manager.create(Image, image);
    return await this.ctx.repo.Image.manager.save(img);
  }
  public async all(): Promise<Image[]> {
    return await this.ctx.repo.Image.manager.find(Image);
  }
  public async count() {
    return await this.ctx.repo.Image.manager.count(Image);
  }
  public async remove(id: string) {
    await this.ctx.repo.Image.manager.delete(Image, { _id: id });
    return true
  }
  public async removes(ids: string[]) {
    await mapAsync(ids, async (id: string) => {
      await this.ctx.repo.Image.manager.delete(Image, { _id: id });
      // await this.ctx.repo.Image.createQueryBuilder('image').where('image._id = :id', { id }).delete().execute();
    });
  }
  public async insert(_image: Image) {
    return await this.ctx.repo.Image.manager.insert(Image, _image);
  }
  public async update(_image: Image) {
    return await this.ctx.repo.Image.manager.update(Image, _image._id, _image);
  }
  public async getLabels(image: Image): Promise<Label[]> {
    return await this.service.label.getForItem(image._id);
  }
  public async setLabels(image: Image, labelIds: string[]): Promise<Label[]> {
    if (labelIds.length == 0) return [];
    await this.service.label.setForItem(image._id, labelIds, "image");
    return await this.ctx.service.image.getLabels(image);
  }
  public async removeLabel() {

  }
}
