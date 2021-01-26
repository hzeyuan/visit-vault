import { Context } from 'egg';
const Jimp = require('jimp')
import { ObjectID } from 'mongodb';
import Image, { ImageMeta } from '../../entity/sys/Image';
import { copyFileAsync, statAsync, unlinkAsync } from '../../utils/fs/async';
import { libraryPath } from '../../utils/path';

const COLOR_HEX_STRING = /^#[a-f0-9]{6}$/;
function isHexColorString(str: string) {
  return COLOR_HEX_STRING.test(str);
}



export = {
  Query: {
    numImages: async (root, options, ctx: Context) => {
      return ctx.service.image.count();
    },
    getImages: async (root, options: QueryGetImagesArgs, ctx: Context): Promise<Query['getImages']> => {
      const { query } = options;
      const { skip, page, take } = query;
      const timeNow = +new Date();
      return await ctx.service.image.searchImages(query);
    },
  },
  Mutation: {
    uploadImage: async (_: unknown,
      options: {
        file: Promise<{
          filename: string;
          mimetype: string;
          createReadStream: () => NodeJS.ReadableStream;
        }>;
        name: string;
        scene?: string;
        studio?: string;
        actors: string[];
        labels: string[];
        lossless?: boolean;
        compress?: boolean;
        crop?: {
          left: number;
          top: number;
          width: number;
          height: number;
        };
      }, ctx: Context): Promise<Image> => {
      // 查找作者
      for (const actor of options.actors || []) {
        const actorInDb = await ctx.service.actor.getById(actor);
        if (!actorInDb) throw new Error(`Actor ${actor} not found`);
      }
      // 添加标签
      for (const label of options.labels || []) {
        const labelInDb = await ctx.service.label.getById(label);
        if (!labelInDb) throw new Error(`Label ${label} not found`);
      }
      // 景点
      if (options.scene) {
        const sceneInDb = await ctx.service.scene.getById(options.scene);
        if (!sceneInDb) throw new Error(`Scene ${options.scene} not found`);
      }
      const { filename } = await options.file;

      // 创建文件唯一标识符
      const _id = new ObjectID().toString();
      // 上传图片
      const outPath = await ctx.upload(options.file, _id);
      ctx.logger.info(`uploading done=> ${outPath}`);


      const image = ctx.repo.Image.manager.create(Image, { _id, name: options.name || _id, meta: new ImageMeta(), favorite: false });
      const { size } = await statAsync(outPath);
      image.meta.size = size;

      // File written, now process
      let processedExt = ".jpg";
      if (options.lossless === true) {
        processedExt = ".png";
      }
      if (filename.includes(".gif")) {
        processedExt = ".gif";
      }
      // 从临时目录 copy到图片资源目录
      const sourcePath = libraryPath(`images/${image._id}${processedExt}`);
      image.path = sourcePath;
      await copyFileAsync(outPath, sourcePath);
      // Process image
      // if (!filename.includes(".gif")) {
      //   if (options.crop) {
      //     options.crop.left = Math.round(options.crop.left);
      //     options.crop.top = Math.round(options.crop.top);
      //     options.crop.width = Math.round(options.crop.width);
      //     options.crop.height = Math.round(options.crop.height);
      //   }

      //   const _image = await Jimp.read(outPath);
      //   image.hash = _image.hash();

      //   if (options.crop) {
      //     ctx.logger.info(`Cropping image...`);
      //     _image.crop(options.crop.left, options.crop.top, options.crop.width, options.crop.height);
      //     image.meta.dimensions.width = options.crop.width;
      //     image.meta.dimensions.height = options.crop.height;
      //   } else {
      //     image.meta.dimensions.width = _image.bitmap.width;
      //     image.meta.dimensions.height = _image.bitmap.height;
      //   }

      //   if (options.compress === true) {
      //     ctx.logger.info("Resizing image to thumbnail size");
      //     // 最大的压缩空间
      //     const MAX_SIZE = 10 * 1024
      //     // const MAX_SIZE = config.processing.imageCompressionSize;

      //     if (_image.bitmap.width > _image.bitmap.height && _image.bitmap.width > MAX_SIZE) {
      //       _image.resize(MAX_SIZE, Jimp.AUTO);
      //     } else if (_image.bitmap.height > MAX_SIZE) {
      //       _image.resize(Jimp.AUTO, MAX_SIZE);
      //     }
      //   }

      //   await _image.writeAsync(sourcePath);
      //   // !isBlacklisted(image.name)
      //   if (true) {
      //     image.thumbPath = libraryPath(`thumbnails/images/${image._id}.jpg`);
      //     ctx.logger.info("Creating image thumbnail");
      //     // Small image thumbnail
      //     if (_image.bitmap.width > _image.bitmap.height && _image.bitmap.width > 320) {
      //       _image.resize(320, Jimp.AUTO);
      //     } else if (_image.bitmap.height > 320) {
      //       _image.resize(Jimp.AUTO, 320);
      //     }
      //     await _image.writeAsync(image.thumbPath);
      //   }

      //   ctx.logger.info(`Image processing done.`);
      // } else {
      //   await copyFileAsync(outPath, sourcePath);
      // }

      // 图片设置作者
      let actorIds = [] as string[];
      if (options.actors) {
        actorIds = options.actors;
        image.actors = await ctx.service.image.setActors(image, actorIds);
      }
      // 图片设置标签
      let labels = [] as string[];
      if (options.labels) {
        labels = options.labels;
        image['labels'] = await ctx.service.image.setLabels(image, labels);
      }

      if (options.scene) {
        const scene = await ctx.service.scene.getById(options.scene);
        if (scene) {
          image.scene = options.scene;
          const sceneActors = (await ctx.service.scene.getActors(scene)).map((a) => a._id);
          actorIds.push(...sceneActors);
          const sceneLabels = (await ctx.service.scene.getLabels(scene)).map((a) => a._id);
          labels.push(...sceneLabels);
        }
      }


      await ctx.service.image.upsert(image);
      await unlinkAsync(outPath);
      ctx.logger.info(`image done=> ${image.name}`);
      return image
    },
    updateImages: async (
      _: unknown,
      options: MutationUpdateImagesArgs, ctx: Context
    ): Promise<Image[]> => {
      // const config = getConfig();
      const updatedImages = [] as Image[];

      for (const id of options.ids) {
        const image = await ctx.service.image.getById(id);

        if (image) {
          const imageLabels: string[] = [];
          // 设置标签
          if (Array.isArray(options.opts.labels)) {
            // If the update sets labels, use those and ignore the existing
            imageLabels.push(...options.opts.labels);
          } else {
            const existingLabels = await ctx.service.image.getLabels(image);
            const existingLabelIds = existingLabels.map((l) => l._id.toString());
            imageLabels.push(...existingLabelIds);
          }
          // 设置作者
          if (Array.isArray(options.opts.actors)) {
            const actorIds = [...new Set(options.opts.actors)];
            await ctx.service.image.setActors(image, actorIds);
          }

          // // 保存到数据中
          image['labels'] = await ctx.service.image.setLabels(image, imageLabels);
          // 这里先暂时设置labels的返回
          // image['labels'] = [];
          if (typeof options.opts.bookmark === "number" || options.opts.bookmark === null) {
            image.bookmark = options.opts.bookmark;
          }

          if (typeof options.opts.favorite === "boolean") {
            image.favorite = options.opts.favorite;
          }

          if (typeof options.opts.name === "string") {
            image.name = options.opts.name.trim();
          }

          if (typeof options.opts.rating === "number") {
            image.rating = options.opts.rating;
          }

          if (options.opts.studio !== undefined) {
            image.studio = options.opts.studio;
          }

          if (options.opts.scene !== undefined) {
            image.scene = options.opts.scene;
          }

          if (options.opts.color && isHexColorString(options.opts.color)) {
            image.color = options.opts.color;
          }

          if (options.opts.customFields) {
            for (const key in options.opts.customFields) {
              const value = options.opts.customFields[key] !== undefined ? options.opts.customFields[key] : null;
              ctx.logger.info(`Set scene custom.${key} to ${JSON.stringify(value)}`);
              options.opts.customFields[key] = value;
            }
            image.customFields = options.opts.customFields;
          }
          ctx.logger.info(`image upsert=> ${JSON.stringify(image)}`);
          await ctx.service.image.upsert(image);
          updatedImages.push(image as any);
        } else {
          throw new Error(`Image ${id} not found`);
        }
      }
      // await indexImages(updatedImages);
      return updatedImages;
    },
    removeImages: async (root, options: MutationRemoveImagesArgs, ctx: Context): Promise<Mutation['removeImages']> => {
      await ctx.service.image.removes(options.ids);
      return true;
    },
    removeLabel: async (root, options: MutationRemoveLabelArgs, ctx: Context): Promise<Mutation['removeLabel']> => {
      ctx.logger.info('remove Label ...');
      const { item, label } = options;
      return await ctx.service.labelledItem.remove(item, label);
    }
  }
};

