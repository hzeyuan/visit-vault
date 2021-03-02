import { Context } from 'egg';


export = {

  Query: {
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

