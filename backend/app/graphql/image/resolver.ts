import { Context } from 'egg';
const Jimp = require('jimp')
import { createWriteStream, ReadStream } from "fs";
import { ObjectID } from 'mongodb';
import Image from '../../entity/sys/Image';
import { ImageMeta } from '../../types/image';
import { mapAsync } from '../../utils/async';
import { copyFileAsync, statAsync, unlinkAsync } from '../../utils/fs/async';
import { libraryPath } from '../../utils/path';
import { getExtension } from '../../utils/string';

const COLOR_HEX_STRING = /^#[a-f0-9]{6}$/;
function isHexColorString(str: string) {
  return COLOR_HEX_STRING.test(str);
}



export = {
  Query: {
    getImages: async (root, options: QueryGetImagesArgs, ctx: Context): Promise<Query['getImages']> => {
      const {query } = options;
      const { skip, page, take } = query;
      const timeNow = +new Date();
      //  这里需要先实现actor_ref
      // 通过actor_ref找到，image_id,聚合起来
      // 需要过滤作者
      if (query.actors!) {
        
      }
      const filters = {
        where: {
          actor:{$eq:''},
        }
      }
      const images = await ctx.service.image.getPage(
        page || 0,
        skip || 0,
        take || undefined,
        // filters
      );
      const total = images.length;
      if (total === 0) {
        ctx.logger.info(`No items in DB, returning 0`);
        return {
          items: [],
          numPages: 0,
          numItems: 0,
        };
      };
      const actor = { _id: 'a', name: 'actor', aliases: ['actor'], favorite: true, customFields: { _id: 'customFields', name: '' }, availableFields: [{ _id: 'c', name: 't', type: 'STRING' }] } as Actor;
      const imgs = await mapAsync(images, async (img) => {
        // img['labels'] = [label];
        const labels = await ctx.service.label.getForItem(img._id);
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
      // const config = getConfig();
      const { filename, mimetype, createReadStream } = await options.file;
      const ext = getExtension(filename); // 文件后缀
      const fileNameWithoutExtension = filename.split(".")[0]; // 文件前缀

      let imageName = fileNameWithoutExtension;

      if (options.name) {
        imageName = options.name;
      }

      //不是图片格式
      if (!mimetype.includes("image/")) {
        throw new Error("Invalid file");
      }
      const _id = new ObjectID().toString();
      const image = ctx.repo.Image.manager.create(Image, { _id, name: imageName, meta: new ImageMeta(), favorite: false });

      const outPath = `/tmp/${image._id}${ext}`;
      ctx.logger.info(`Getting file...`);

      // 读写流
      const read = createReadStream() as ReadStream;
      const write = createWriteStream(outPath);

      const pipe = read.pipe(write);
      await new Promise<void>((resolve) => {
        pipe.on("close", () => resolve());
      });

      const { size } = await statAsync(outPath);
      image.meta.size = size;

      // File written, now process
      ctx.logger.info(`File written to ${outPath}.`);
      let processedExt = ".jpg";
      if (options.lossless === true) {
        processedExt = ".png";
      }
      if (filename.includes(".gif")) {
        processedExt = ".gif";
      }

      const sourcePath = libraryPath(`images/${image._id}${processedExt}`);
      image.path = sourcePath;

      // Process image
      if (!filename.includes(".gif")) {
        if (options.crop) {
          options.crop.left = Math.round(options.crop.left);
          options.crop.top = Math.round(options.crop.top);
          options.crop.width = Math.round(options.crop.width);
          options.crop.height = Math.round(options.crop.height);
        }

        const _image = await Jimp.read(outPath);
        image.hash = _image.hash();

        if (options.crop) {
          ctx.logger.info(`Cropping image...`);
          _image.crop(options.crop.left, options.crop.top, options.crop.width, options.crop.height);
          image.meta.dimensions.width = options.crop.width;
          image.meta.dimensions.height = options.crop.height;
        } else {
          image.meta.dimensions.width = _image.bitmap.width;
          image.meta.dimensions.height = _image.bitmap.height;
        }

        if (options.compress === true) {
          ctx.logger.info("Resizing image to thumbnail size");
          // 最大的压缩空间
          const MAX_SIZE = 10 * 1024
          // const MAX_SIZE = config.processing.imageCompressionSize;

          if (_image.bitmap.width > _image.bitmap.height && _image.bitmap.width > MAX_SIZE) {
            _image.resize(MAX_SIZE, Jimp.AUTO);
          } else if (_image.bitmap.height > MAX_SIZE) {
            _image.resize(Jimp.AUTO, MAX_SIZE);
          }
        }

        await _image.writeAsync(sourcePath);
        // !isBlacklisted(image.name)
        if (true) {
          image.thumbPath = libraryPath(`thumbnails/images/${image._id}.jpg`);
          ctx.logger.info("Creating image thumbnail");
          // Small image thumbnail
          if (_image.bitmap.width > _image.bitmap.height && _image.bitmap.width > 320) {
            _image.resize(320, Jimp.AUTO);
          } else if (_image.bitmap.height > 320) {
            _image.resize(Jimp.AUTO, 320);
          }
          await _image.writeAsync(image.thumbPath);
        }

        ctx.logger.info(`Image processing done.`);
      } else {
        await copyFileAsync(outPath, sourcePath);
      }

      let actorIds = [] as string[];
      if (options.actors) {
        actorIds = options.actors;
      }

      let labels = [] as string[];
      if (options.labels) {
        labels = options.labels;
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

      // if (options.studio) {
      //   const studio = await Studio.getById(options.studio);
      //   if (studio) image.studio = options.studio;
      // }

      // Extract actors
      // const extractedActors = await extractActors(image.name);

      // ctx.logger.info(`Found ${extractedActors.length} actors in image path.`);
      // actorIds.push(...extractedActors);
      // await Image.setActors(image, actorIds);

      // // Extract labels
      // const extractedLabels = await extractLabels(image.name);
      // ctx.logger.info(`Found ${extractedLabels.length} labels in image path.`);
      // labels.push(...extractedLabels);

      // if (
      //   config.matching.applyActorLabels.includes(ApplyActorLabelsEnum.enum["event:image:create"])
      // ) {
      //   ctx.logger.info("Applying actor labels to image");
      //   const actors = await Actor.getBulk(actorIds);
      //   const actorLabels = (
      //     await mapAsync(actors, async (actor) => (await Actor.getLabels(actor)).map((l) => l._id))
      //   ).flat();
      //   labels.push(...actorLabels);
      // }

      // await Image.setLabels(image, labels);

      // Done
      ctx.logger.info(`image creating=> ${JSON.stringify(image)}`);
      await ctx.service.image.upsert(image);
      // await imageCollection.upsert(image._id, image);
      // await indexImages([image]);
      await unlinkAsync(outPath);
      ctx.logger.info(`Image '${imageName}' done.`);
      // 作者和标签，先使用假数据
      image.actors = [];
      image['labels'] = [];
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
          // if (Array.isArray(options.opts.actors)) {
          //   const actorIds = [...new Set(options.opts.actors)];
          //   await Image.setActors(image, actorIds);

          //   if (
          //     config.matching.applyActorLabels.includes(
          //       ApplyActorLabelsEnum.enum["event:image:update"]
          //     )
          //   ) {
          //     const actors = await Actor.getBulk(actorIds);
          //     const actorLabelIds = (await mapAsync(actors, Actor.getLabels))
          //       .flat()
          //       .map((label) => label._id);

          //     logger.log("Applying actor labels to image");
          //     imageLabels.push(...actorLabelIds);
          //   }
          // }

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
      // await LabelledItem.remove(item, label);
      // if (item.startsWith("sc_")) {
      //   const scene = await Scene.getById(item);
      //   if (scene) {
      //     await indexScenes([scene]);
      //   }
      // } else if (item.startsWith("im_")) {
      //   const image = await Image.getById(item);
      //   if (image) {
      //     await indexImages([image]);
      //   }
      // } else if (item.startsWith("st_")) {
      //   const studio = await Studio.getById(item);
      //   if (studio) {
      //     await indexStudios([studio]);
      //   }
      // } else if (item.startsWith("ac_")) {
      //   const actor = await Actor.getById(item);
      //   if (actor) {
      //     await indexActors([actor]);
      //   }
      // }
    }
  }
};

