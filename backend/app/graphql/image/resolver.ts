import { Context } from 'egg';
// import Jimp from "jimp";
const Jimp = require('jimp')
import { createWriteStream, ReadStream } from "fs";
import Image from '../../types/image';
import { copyFileAsync, statAsync, unlinkAsync } from '../../utils/fs/async';
import { libraryPath } from '../../utils/path';
import { getExtension } from '../../utils/string';
export = {

  Query: {
    getImages: async (root, params: QueryGetImagesArgs, ctx: Context): Promise<Query['getImages']> => {
      console.log(ctx, root);
      const actor = { _id: 'a', name: 'actor', aliases: ['actor'], favorite: true, customFields: { _id: 'customFields', name: '' }, availableFields: [{ _id: 'c', name: 't', type: 'STRING' }] } as Actor;
      const label = { _id: 'l', name: 'label', aliases: ['label'] } as Label;
      return {
        numItems: 1,
        numPages: 0,
        items: [
          {
            _id: '1',
            addedOn: 'addedOn',
            favorite: true,
            customFields: { _id: 'customFields' },
            name: '图片',
            path: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa0.att.hudong.com%2F52%2F62%2F31300542679117141195629117826.jpg&refer=http%3A%2F%2Fa0.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1611576383&t=63182d5eb71da0dc476244c3a9ceb76e',
            meta: {
              dimensions: {
                height: '300',
                width: '300',
              },
            },
            actors: [actor],
            labels: [label],
          },

        ],
      };
    },
  },
  Mutation: {
    uploadImage: async (_: unknown,
      args: {
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
      // for (const actor of args.actors || []) {
      //   const actorInDb = await Actor.getById(actor);

      //   if (!actorInDb) throw new Error(`Actor ${actor} not found`);
      // }

      // for (const label of args.labels || []) {
      //   const labelInDb = await Label.getById(label);

      //   if (!labelInDb) throw new Error(`Label ${label} not found`);
      // }
      // if (args.scene) {
      //   const sceneInDb = await Scene.getById(args.scene);

      //   if (!sceneInDb) throw new Error(`Scene ${args.scene} not found`);
      // }
      // const config = getConfig();
      const { filename, mimetype, createReadStream } = await args.file;
      const ext = getExtension(filename); // 文件后缀
      const fileNameWithoutExtension = filename.split(".")[0]; // 文件前缀

      let imageName = fileNameWithoutExtension;

      if (args.name) {
        imageName = args.name;
      }

      //不是图片格式
      if (!mimetype.includes("image/")) {
        throw new Error("Invalid file");
      }
      const image = new Image(imageName);

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
      if (args.lossless === true) {
        processedExt = ".png";
      }
      if (filename.includes(".gif")) {
        processedExt = ".gif";
      }

      const sourcePath = libraryPath(`images/${image._id}${processedExt}`);
      image.path = sourcePath;

      // Process image
      if (!filename.includes(".gif")) {
        if (args.crop) {
          args.crop.left = Math.round(args.crop.left);
          args.crop.top = Math.round(args.crop.top);
          args.crop.width = Math.round(args.crop.width);
          args.crop.height = Math.round(args.crop.height);
        }
        
        const _image = await Jimp.read(outPath);
        image.hash = _image.hash();

        if (args.crop) {
          ctx.logger.info(`Cropping image...`);
          _image.crop(args.crop.left, args.crop.top, args.crop.width, args.crop.height);
          image.meta.dimensions.width = args.crop.width;
          image.meta.dimensions.height = args.crop.height;
        } else {
          image.meta.dimensions.width = _image.bitmap.width;
          image.meta.dimensions.height = _image.bitmap.height;
        }

        if (args.compress === true) {
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

      // let actorIds = [] as string[];
      // if (args.actors) {
      //   actorIds = args.actors;
      // }

      // let labels = [] as string[];
      // if (args.labels) {
      //   labels = args.labels;
      // }

      // if (args.scene) {
      //   const scene = await Scene.getById(args.scene);

      //   if (scene) {
      //     image.scene = args.scene;

      //     const sceneActors = (await Scene.getActors(scene)).map((a) => a._id);
      //     actorIds.push(...sceneActors);
      //     const sceneLabels = (await Scene.getLabels(scene)).map((a) => a._id);
      //     labels.push(...sceneLabels);
      //   }
      // }

      // if (args.studio) {
      //   const studio = await Studio.getById(args.studio);
      //   if (studio) image.studio = args.studio;
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
      ctx.logger.info("Creating image:");
      ctx.logger.info(image);

      // await imageCollection.upsert(image._id, image);
      // await indexImages([image]);
      await unlinkAsync(outPath);
      ctx.logger.info(`Image '${imageName}' done.`);
      return image
    }
  }
};

