import { Context } from 'egg';
import Actor from '../../entity/sys/Actor';
// import { isValidCountryCode } from '../../types/countries';
import { filterInvalidAliases, isArrayEq } from '../../utils/misc';

export = {

  Query: {
    getActors: async (root, params: QueryGetActorsArgs, ctx: Context): Promise<| {
      numItems: number,
      numPages: number,
      items: Actor[],
    }
      | undefined> => {
      console.log(ctx, root);
      const timeNow = +new Date();

      let actors = await ctx.service.actor.all();
      const count = actors.length;
      actors = actors.map(actor => { actor['availableFields'] = {}; actor['getCustomFields'] = {}; return actor });
      return {
        numItems: count,
        numPages: 1,
        items: actors,
      };
    },
  },
  Mutation: {
    addActor: async (root, args: MutationAddActorArgs, ctx: Context) => {
      // const config = getConfig();
      const { logger } = ctx;
      const aliases = filterInvalidAliases(args.aliases || []);
      const actor = await ctx.service.actor.create({ name: args.name, aliases, favorite: false } as Actor);
      // let actor = new Actor(args.name, aliases);

      let actorLabels = [] as string[];
      if (args.labels) {
        actorLabels = args.labels;
      }

      // try {
      //   actor = await ctx.service.actor.onActorCreate(actor, actorLabels);
      // } catch (error) {
      //   logger.error(error);
      // }

      await ctx.service.actor.setLabels(actor, actorLabels);
      // await actorCollection.upsert(actor._id, actor);

      // await Actor.findUnmatchedScenes(
      //   actor,
      //   config.matching.applyActorLabels.includes(ApplyActorLabelsEnum.enum["event:actor:create"])
      //     ? actorLabels
      //     : []
      // );
      // await indexActors([actor]);
      return actor;
    },
    updateActors: async (root, args: MutationUpdateActorsArgs, ctx: Context) => {
      const { ids, opts } = args;
      // const config = getConfig();
      const updatedActors = [] as Actor[];

      let didLabelsChange = false;

      for (const id of ids) {
        const actor = await ctx.service.actor.getById(id);

        if (actor) {
          if (typeof opts.name === "string") {
            actor.name = opts.name.trim();
          }

          if (Array.isArray(opts.aliases)) {
            actor.aliases = [...new Set(filterInvalidAliases(opts.aliases))];
          }

          if (Array.isArray(opts.labels)) {
            const oldLabels = await ctx.service.actor.getLabels(actor);
            await ctx.service.actor.setLabels(actor, opts.labels);
            if (
              !isArrayEq(
                oldLabels,
                opts.labels,
                (l) => l._id,
                (l) => l
              )
            ) {
              didLabelsChange = true;
            }
          }

          // if (typeof opts.nationality !== undefined) {
          //   if (typeof opts.nationality === "string" && isValidCountryCode(opts.nationality)) {
          //     actor.nationality = opts.nationality;
          //   } else if (opts.nationality === null) {
          //     actor.nationality = opts.nationality;
          //   }
          // }

          if (typeof opts.bookmark === "number" || opts.bookmark === null) {
            actor.bookmark = opts.bookmark;
          }

          if (typeof opts.favorite === "boolean") {
            actor.favorite = opts.favorite;
          }

          if (typeof opts.description === "string") {
            actor.description = opts.description.trim();
          }

          if (typeof opts.avatar === "string" && !opts.avatar) {
            actor.avatar = opts.avatar;
          }

          if (typeof opts.thumbnail === "string" || opts.thumbnail === null) {
            actor.thumbnail = opts.thumbnail;
          }

          if (typeof opts.altThumbnail === "string" || opts.altThumbnail === null) {
            actor.altThumbnail = opts.altThumbnail;
          }

          if (typeof opts.hero === "string" || opts.hero === null) {
            actor.hero = opts.hero;
          }

          if (typeof opts.rating === "number") {
            actor.rating = opts.rating;
          }

          if (opts.bornOn !== undefined) {
            actor.bornOn = opts.bornOn;
          }

          if (opts.customFields) {
            for (const key in opts.customFields) {
              const value = opts.customFields[key] !== undefined ? opts.customFields[key] : null;
              ctx.logger.info(`Set actor custom.${key} to ${JSON.stringify(value)}`);
              opts.customFields[key] = value;
            }
            actor.customFields = opts.customFields;
          }

          // await actorCollection.upsert(actor._id, actor);
          updatedActors.push(actor);
        } else {
          throw new Error(`Actor ${id} not found`);
        }

        // if (didLabelsChange) {
        //   const labelsToPush = config.matching.applyActorLabels.includes(
        //     ApplyActorLabelsEnum.enum["event:actor:update"]
        //   )
        //     ? (await ctx.service.actor.getLabels(actor)).map((l) => l._id)
        //     : [];
        //   await Actor.pushLabelsToCurrentScenes(actor, labelsToPush).catch((err) => {
        //     ctx.logger.error(`Error while pushing actor "${actor.name}"'s labels to scenes`);
        //     ctx.logger.error(err);
        //   });
        // }
      }

      // await indexActors(updatedActors);
      return updatedActors;
    },
    removeActors: async () => {

    },
    runActorPlugins: async () => {

    },
    attachActorToUnmatchedScenes: async () => {

    }
  }
};

