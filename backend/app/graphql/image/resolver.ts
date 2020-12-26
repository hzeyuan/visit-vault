import { Context } from 'egg';


export = {

  Query: {
    getImages: async (root, params: QueryGetImagesArgs, ctx: Context): Promise<Query['getImages']> => {
      console.log(ctx, root);
      const actor = { _id: 'a', name: 'actor', aliases: [ 'actor' ], favorite: true, customFields: { _id: 'customFields', name: '' }, availableFields: [{ _id: 'c', name: 't', type: 'STRING' }] } as Actor;
      const label = { _id: 'l', name: 'label', aliases: [ 'label' ] } as Label;
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
            actors: [ actor ],
            labels: [ label ],
          },

        ],
      };
    },
  },
};

