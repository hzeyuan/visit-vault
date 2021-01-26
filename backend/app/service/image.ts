import { Service } from 'egg';
import { FindManyOptions } from 'typeorm';
import Image from '../entity/sys/Image'
import Actor from '../entity/sys/Actor';
import { mapAsync } from '../utils/async';




export default class ImageService extends Service {
  public async getById(id: string): Promise<Image | undefined> {
    const image = await this.ctx.repo.Image.manager.findOne(Image, { _id: id })
    return image;
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
  public async getActors(image: Image): Promise<Actor[]> {
    return await this.service.actor.getForItem(image._id);
  }
  public async setActors(image: Image, actorIds: string[]) {
    if (actorIds.length == 0) return [];
    await this.service.actor.setForItem(image._id, actorIds, "image");
    return await this.ctx.service.image.getActors(image);
  }
  // 搜索查询图片
  public async searchImages(options: ImageSearchQuery): Promise<ImageSearchResults> {
    const pageSize = getPageSize(options.take);
    const filters = {
      ...await this.service.search.actorsFilters(options.actors),
      ...await this.service.search.labelsFilters(options.include),
      ...this.service.search.ratingFilters(options.rating, 'eq'),
      ...this.service.search.bookmarkFilters(options.bookmark),
      ...this.service.search.favoriteFilters(options.favorite),
    }
    const images = await this.ctx.repo.Image.manager.find(Image,
      {
        skip: options.skip || Math.max(0, +(options.page || 0) * pageSize),
        take: options.take,
        ...filters,
        ...this.service.search.sortBy(options.sortBy, options.sortDir),
      } as FindManyOptions);
    const total = images.length;
    if (total === 0) {
      this.ctx.logger.info(`No items in DB, returning 0`);
      return {
        items: [],
        numPages: 0,
        numItems: 0,
      };
    };
    const imgs = await mapAsync(images, async (img) => {
      const labels = await this.ctx.service.label.getForItem(img._id);
      const actors = await this.ctx.service.actor.getForItem(img._id);
      img.labels = labels;
      img.actors = actors;
      return img;
    });
    return {
      numItems: total,
      numPages: Math.ceil(total / 20),
      items: imgs,
    };
  }
}
