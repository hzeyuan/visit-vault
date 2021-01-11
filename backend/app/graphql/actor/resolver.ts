import { Context } from 'egg';
import Actor from '../../entity/sys/Actor';

export = {

  Query: {
    getActors: async (root, params: QueryGetActorsArgs, ctx: Context): Promise<| {
      numItems: number;
      numPages: number;
      items: Actor[];
    }
      | undefined> => {
      console.log(ctx, root);
      const timeNow = +new Date();

      const actors = await ctx.service.actor.all();
      const count = actors.length;
      // const imgs = actors.map(img => { img['labels'] = [label]; img.actors = [] as any; return img });
      return {
        numItems: count,
        numPages: 1,
        items: actors,
      };
    },
  },
};

