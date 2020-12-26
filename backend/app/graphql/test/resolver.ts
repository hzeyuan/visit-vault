import { Context } from 'egg';


export = {

  Query: {

    q: async (root, params: QueryQArgs, ctx: Context): Promise<Query['q']> => {
      console.log(params.id);
      console.log(ctx, root);
      return {
        id: '1',
      };
    },
  },

  Mutation: {
    m: async (root, input: Minput, ctx: Context): Promise<Mutation['m']> => {
      console.log(input?.id);
      console.log(ctx, root);
      return {
        id: '1',
      };
    },
  },
};

