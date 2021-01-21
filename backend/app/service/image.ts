import { Service } from 'egg';
import { FindManyOptions } from 'typeorm';
import Image from '../entity/sys/Image'
// import Label from '../types/label';
import { mapAsync } from '../utils/async';
import ActorService from './actor';

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
  // 搜索查询图片
  public async searchImages(options: ImageSearchQuery): Promise<ImageSearchResults> {

    // 存在作者
    const actorsFilters = (actors?: string[] | null) => {
      return actors && actors.length > 0 ? {
        where: { actors: { $in: actors } },
      } : {}
    }
    const ratingFilters = (rate?: number | null, key: 'eq' | 'lt' | 'lg' = 'eq') => {
      return rate ? {
        where: {
          rate: { [`${key}`]: rate }
        },
      } : {}
    }
    const bookmarkFilters = (bookmark?: boolean | null) => {
      return bookmark ? {
        where: {
          bookmark:
            { $eq: bookmark }
        }
        ,
      } : {}
    }
    const favoriteFilters = (favorite?: boolean | null) => {
      return favorite ? {

        where: {
          favorite:
            { $eq: favorite }
        },
      } : {}
    }
    const filters = {
      ...actorsFilters(options.actors),
      ...ratingFilters(options.rating, 'eq'),
      ...bookmarkFilters(options.bookmark),
      ...favoriteFilters(options.favorite),
    }
    const images = await this.getPage(options.page || 0, options.skip || 0, options.take || undefined, filters)
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
      // img['labels'] = [label];
      const labels = await this.ctx.service.label.getForItem(img._id);
      // const actors = await ctx.service.actor.getForItem(img._id);
      img['labels'] = labels;

      img.actors = [];
      return img;
    });
    return {
      numItems: total,
      numPages: Math.ceil(total / 20),
      items: imgs,
    };
  }
}
