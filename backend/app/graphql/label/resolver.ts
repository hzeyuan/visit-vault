import { Context } from 'egg';
// import Jimp from "jimp";
const Jimp = require('jimp')
import { createWriteStream, ReadStream } from "fs";
import Label from '../../entity/sys/Label';
import Image from '../../types/image';
import { mapAsync } from '../../utils/async';
// import Image from '../../entity/sys/Image';
import { copyFileAsync, statAsync, unlinkAsync } from '../../utils/fs/async';
import { filterInvalidAliases } from '../../utils/misc';
import { libraryPath } from '../../utils/path';
import { getExtension } from '../../utils/string';

const COLOR_HEX_STRING = /^#[a-f0-9]{6}$/;
function isHexColorString(str: string) {
  return COLOR_HEX_STRING.test(str);
}



export = {

  Query: {
    getLabels: async (root, _, ctx: Context): Promise<Query['getLabels']> => {
      console.log(ctx, root);
      const labels = await ctx.service.label.all();
      return labels;
    },
  },
  Mutation: {
    addLabel: async (root, args: MutationAddLabelArgs, ctx: Context): Promise<Mutation['addLabel']> => {
      const aliases = filterInvalidAliases(args.aliases || []);
      // const label = new Label(args.name, aliases);
      // const localExtractLabels = await buildLabelExtractor([label]);
      // TODO: don't use scene.getAll, use search instead
      // for (const scene of await Scene.getAll()) {
      //   if (localExtractLabels(scene.path || scene.name).includes(label._id)) {
      //     const labels = (await Scene.getLabels(scene)).map((l) => l._id);
      //     labels.push(label._id);
      //     await Scene.setLabels(scene, labels);
      //     await indexScenes([scene]);
      //     ctx.logger.info(`Updated labels of ${scene._id}.`);
      //   }
      // }

      /* for (const image of await Image.getAll()) {
        if (isBlacklisted(image.name)) continue;
  
        if (isMatchingItem(image.path || image.name, label, false)) {
          const labels = (await Image.getLabels(image)).map((l) => l._id);
          labels.push(label._id);
          await Image.setLabels(image, labels);
          await indexImages([image]);
          logger.log(`Updated labels of ${image._id}.`);
        } 
      } */

      
      const label = await ctx.service.label.create({ name: args.name, aliases } as Label);
      // await labelCollection.upsert(label._id, label);
      // return label;
      return label;
    }
  }
};

