import { Context } from 'egg';
const Jimp = require('jimp')
import Label from '../../entity/sys/Label';
// import Image from '../../entity/sys/Image';
import { filterInvalidAliases } from '../../utils/misc';
import { isHexColor } from '../../utils/string';

const COLOR_HEX_STRING = /^#[a-f0-9]{6}$/;
function isHexColorString(str: string) {
  return COLOR_HEX_STRING.test(str);
}



export = {

  Query: {
    numLabels: async (root, options, ctx: Context) => {
      return await ctx.service.label.count();
    },
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


      const label = await ctx.service.label.upsert({ name: args.name, aliases } as Label);
      // await labelCollection.upsert(label._id, label);
      // return label;
      return label;
    },
    updateLabels: async (root, args: MutationUpdateLabelsArgs, ctx: Context): Promise<Mutation['updateLabels']> => {
      const updatedLabels = [] as Label[];
      const { opts, ids } = args;
      for (const id of ids) {
        const label = await ctx.service.label.getById(id);
        if (label) {
          if (Array.isArray(opts.aliases)) {
            label.aliases = [...new Set(filterInvalidAliases(opts.aliases))];
          }
          if (opts.name) {
            label.name = opts.name.trim();
          }

          // if (opts.thumbnail) {
          //   label.thumbnail = opts.thumbnail;
          // }

          if (opts.color && isHexColor(opts.color)) {
            label.color = opts.color;
          } else if (opts.color === "") {
            label.color = null;
          }
          await ctx.service.label.update(label._id, label);
          // await labelCollection.upsert(label._id, label);
          updatedLabels.push(label);
        } else {
          throw new Error(`Label ${id} not found`);
        }
      }

      return updatedLabels;
    },
    removeLabels: async (root, args: MutationRemoveLabelsArgs, ctx: Context): Promise<Mutation['removeLabels']> => {
      const { ids } = args;
      for (const id of ids) {
        // const label = await ctx.service.label.getById(id);
        await ctx.service.label.remove(id);

        // await Label.remove(label._id);
        // await ctx.service.labelledItem.removeByLabel(id);
        // await LabelledItem.removeByLabel(id);
        // if (label) {
        // }
      }
      return true;
    }
  },

};

