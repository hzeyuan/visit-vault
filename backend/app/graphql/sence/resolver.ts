 import { Context } from 'egg';


export = {

  Query: {
    numScenes: async (root, options, ctx: Context) => {
      return ctx.service.scene.count();
    },
    getScenes: async (root, params: QueryGetScenesArgs, ctx: Context): Promise<Query['getScenes']> => {
      console.log(ctx, root);
      return {
        numItems: 0,
        numPages: 0,
        items: [],
      };
    },
  },
};

