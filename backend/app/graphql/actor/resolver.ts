import { Context } from 'egg';
import Actor from '../../entity/sys/Actor';
import { mapAsync } from '../../utils/async';
// import { isValidCountryCode } from '../../types/countries';
import { filterInvalidAliases, isArrayEq } from '../../utils/misc';

export = {

  Query: {
    getActors: async (root, options: QueryGetActorsArgs, ctx: Context): Promise<| {
      numItems: number,
      numPages: number,
      items: Actor[],
    }
      | undefined> => {
      const { query } = options;
      const { skip, page, take } = query;
      // let actors = await ctx.service.actor.all();
      const actors = await ctx.service.actor.getPage(page!, skip!, take!);
      const total = actors.length;
      if (total === 0) {
        ctx.logger.info(`No items in ES, returning 0`);
        return {
          items: [],
          numPages: 0,
          numItems: 0,
        };
      }
      // 给actor设置标签
      await mapAsync(actors, async (actor) => {
        const labels = await ctx.service.actor.getLabels(actor)
        if (labels) actor['labels'] = labels;
        return actor
      });
      return {
        numItems: total,
        numPages: Math.ceil(total / 20),
        items: actors,
      };
    },
    getActorById: async (root, options: QueryGetActorByIdArgs, ctx: Context): Promise<Actor | null> => {
      const actor = await ctx.service.actor.getById(options.id);
      if (!actor) return null;
      actor['numScenes'] = 0
      actor.customFields = {};
      actor['collabs'] = [];
      // actor.avatar = 'https://avatars2.githubusercontent.com/u/29333699?s=460&u=0c288b893224afe4d909bc4bc8ef0524805b480d&v=4'
      actor['labels'] = []
      return actor;

    },
  },
  Mutation: {
    addActor: async (root, options: MutationAddActorArgs, ctx: Context) => {
      // const config = getConfig();
      const { logger } = ctx;
      const aliases = filterInvalidAliases(options.aliases || []);
      const actor = await ctx.service.actor.create({ name: options.name, aliases, favorite: false } as Actor);
      // let actor = new Actor(options.name, aliases);

      let actorLabels = [] as string[];
      if (options.labels) {
        actorLabels = options.labels;
      }

      // 插件相关设置
      // try {
      //   let a  = await ctx.service.actor.onActorCreate(actor, actorLabels);
      // } catch (error) {
      //   logger.error(error);
      // }
      // 给lactor设置label
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
    updateActors: async (root, options: MutationUpdateActorsArgs, ctx: Context) => {
      const { ids, opts } = options;
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

          if (typeof opts.avatar === "string" && opts.avatar) {
            const avatar = await ctx.service.image.getById(opts.avatar);
            if (!avatar) return;
            console.log('avatar', avatar);
            actor.avatar = avatar;
          }

          if (typeof opts.thumbnail === "string" && opts.thumbnail) {
            const thumbnail = await ctx.service.image.getById(opts.thumbnail);
            if (!thumbnail) return;
            actor.thumbnail = thumbnail;
          }

          if (typeof opts.altThumbnail === "string" && opts.altThumbnail) {
            const altThumbnail = await ctx.service.image.getById(opts.altThumbnail);
            if (!altThumbnail) return;
            actor.altThumbnail = altThumbnail;
          }

          if (typeof opts.hero === "string" && opts.hero) {
            const hero = await ctx.service.image.getById(opts.hero);
            if (!hero) return;
            actor.hero = hero;
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
          await ctx.service.actor.upsert(actor);
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

