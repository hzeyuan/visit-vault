import { Service } from 'egg';
import { FindManyOptions } from 'typeorm';
import Actor from '../entity/sys/Actor'
import { ObjectID } from 'mongodb';
import ActorReference from '../entity/sys/ActorReference';
import { mapAsync } from '../utils/async';
import { arrayDiff, filterInvalidAliases, validRating } from '../utils/misc';

const DEFAULT_PAGE_SIZE = 20;
const getPageSize = (take?: number): number => {
  return take || DEFAULT_PAGE_SIZE;
}

export default class ActorService extends Service {
  public async getById(id: string): Promise<Maybe<Actor>> {
    const actor = await this.ctx.repo.Actor.manager.findOne(Actor, id)
    return typeof actor !== 'undefined' ? actor : null;
  }
  public async create(_actor: Actor) {
    const actor = await this.ctx.repo.Actor.manager.create(Actor, _actor);
    return this.ctx.repo.Actor.manager.save(actor);
  }
  public async getPage(page: number | undefined, skip: number | undefined, take: number | undefined) {
    const pageSize = getPageSize(take);
    return await this.ctx.repo.Actor.manager.find(Actor, { skip: skip || Math.max(0, +(page || 0) * pageSize), take } as FindManyOptions);
  }
  public async all(): Promise<Actor[]> {
    return await this.ctx.repo.Actor.manager.find(Actor);
  }
  public async count() {
    return await this.ctx.repo.Actor.manager.count(Actor);
  }
  public async remove(id: string) {
    await this.ctx.repo.Actor.manager.delete(Actor, { _id: id });
    return true
  }
  public async getBulk(_ids: string[]): Promise<Actor[]> {
    const ids = _ids.map(id => new ObjectID(id));
    return await this.ctx.repo.Actor.findByIds(ids);
  }
  public async removes(ids: string[]) {
    await mapAsync(ids, async (id: string) => {
      await this.ctx.repo.Actor.manager.delete(Actor, { _id: id });
    });
  }
  public async getLabels(actor: Actor): Promise<Label[]> {
    return await this.ctx.service.label.getForItem(actor._id);
  }
  public async getForItem(id: string): Promise<Actor[]> {
    const references = await this.service.actorReference.getByItem(id);
    return await this.service.actor.getBulk(references.map((r) => r.actor));
  }
  public async setForItem(itemId: string, actorIds: string[], type: string): Promise<void> {
    const oldRefs = await this.service.actorReference.getByItem(itemId);

    const { removed, added } = arrayDiff(oldRefs, [...new Set(actorIds)], "actor", (l) => l);
    const oldRefIds = removed.map(oldRef => oldRef._id);
    await this.service.labelledItem.removes(oldRefIds);
    const labelledItems = added.map(actorId => this.ctx.repo.LabelledItem.manager.create(ActorReference, { actor: actorId, item: itemId, type }));
    await this.service.actorReference.insert(labelledItems);

  }
  public async setLabels(actor: Actor, labelIds: string[]) {
    if (labelIds.length == 0) return [];
    await this.service.label.setForItem(actor._id, labelIds, "actor");
    return await this.ctx.service.actor.getLabels(actor);
    // return this.setForItem(actor._id, labelIds, "actor");
  }

  // public async onActorCreate(actor: Actor, labels: string[], event: "actorCreated" | "actorCustom" = "actorCreated"): Promise<Actor> {
  //   const config = getConfig();
  //   const createdImages = [] as Image[];
  //   const pluginResult = await this.ctx.service.plugin.runPluginsSerial(config, event, {
  //     actor: JSON.parse(JSON.stringify(actor)) as Actor,
  //     actorName: actor.name,
  //     // countries: JSON.parse(JSON.stringify(countries)) as ICountry[],
  //     $createLocalImage: async (path: string, name: string, thumbnail?: boolean) => {
  //       const img = await createLocalImage(path, name, thumbnail);
  //       await Image.addActors(img, [actor._id]);
  //       await imageCollection.upsert(img._id, img);

  //       if (!thumbnail) {
  //         createdImages.push(img);
  //       }
  //       return img._id;
  //     },
  //     $createImage: async (url: string, name: string, thumbnail?: boolean) => {
  //       const img = await createImage(url, name, thumbnail);
  //       await Image.setActors(img, [actor._id]);
  //       await imageCollection.upsert(img._id, img);
  //       if (!thumbnail) {
  //         createdImages.push(img);
  //       }
  //       return img._id;
  //     },
  //   });
  //   if (
  //     typeof pluginResult.thumbnail === "string" &&
  //     pluginResult.thumbnail.startsWith("im_") &&
  //     (!actor.thumbnail || config.plugins.allowActorThumbnailOverwrite)
  //   ) {
  //     actor.thumbnail = pluginResult.thumbnail;
  //   }

  //   if (
  //     typeof pluginResult.altThumbnail === "string" &&
  //     pluginResult.altThumbnail.startsWith("im_") &&
  //     (!actor.altThumbnail || config.plugins.allowActorThumbnailOverwrite)
  //   ) {
  //     actor.altThumbnail = pluginResult.altThumbnail;
  //   }

  //   if (
  //     typeof pluginResult.avatar === "string" &&
  //     pluginResult.avatar.startsWith("im_") &&
  //     (!actor.avatar || config.plugins.allowActorThumbnailOverwrite)
  //   ) {
  //     actor.avatar = pluginResult.avatar;
  //   }

  //   if (
  //     typeof pluginResult.hero === "string" &&
  //     pluginResult.hero.startsWith("im_") &&
  //     (!actor.hero || config.plugins.allowActorThumbnailOverwrite)
  //   ) {
  //     actor.hero = pluginResult.hero;
  //   }

  //   if (typeof pluginResult.name === "string") {
  //     actor.name = pluginResult.name;
  //   }

  //   if (typeof pluginResult.description === "string") {
  //     actor.description = pluginResult.description;
  //   }

  //   if (typeof pluginResult.bornOn === "number") {
  //     actor.bornOn = new Date(pluginResult.bornOn).valueOf();
  //   }

  //   if (typeof pluginResult.addedOn === "number") {
  //     actor.addedOn = new Date(pluginResult.addedOn).valueOf();
  //   }

  //   if (pluginResult.aliases && Array.isArray(pluginResult.aliases)) {
  //     actor.aliases.push(...pluginResult.aliases);
  //     actor.aliases = [...new Set(filterInvalidAliases(actor.aliases))];
  //   }

  //   if (pluginResult.custom && typeof pluginResult.custom === "object") {
  //     const localExtractFields = await buildFieldExtractor();
  //     for (const key in pluginResult.custom) {
  //       const fields = localExtractFields(key);
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //       if (fields.length) actor.customFields[fields[0]] = pluginResult.custom[key];
  //     }
  //   }

  //   if (validRating(pluginResult.rating)) {
  //     actor.rating = pluginResult.rating;
  //   }

  //   if (typeof pluginResult.favorite === "boolean") {
  //     actor.favorite = pluginResult.favorite;
  //   }

  //   if (typeof pluginResult.bookmark === "number") {
  //     actor.bookmark = pluginResult.bookmark;
  //   }

  //   if (pluginResult.nationality !== undefined) {
  //     if (
  //       typeof pluginResult.nationality === "string" &&
  //       isValidCountryCode(pluginResult.nationality)
  //     ) {
  //       actor.nationality = pluginResult.nationality.toUpperCase();
  //     } else if (pluginResult.nationality === null) {
  //       actor.nationality = pluginResult.nationality;
  //     }
  //   }

  //   if (pluginResult.labels && Array.isArray(pluginResult.labels)) {
  //     const labelIds = [] as string[];
  //     const localExtractLabels = await buildLabelExtractor();
  //     for (const labelName of pluginResult.labels) {
  //       const extractedIds = localExtractLabels(labelName);
  //       if (extractedIds.length) {
  //         labelIds.push(...extractedIds);
  //         this.ctx.logger.info(`Found ${extractedIds.length} labels for ${<string>labelName}:`);
  //         this.ctx.logger.info(extractedIds);
  //       } else if (config.plugins.createMissingLabels) {
  //         const label = new Label(labelName);
  //         labelIds.push(label._id);
  //         await labelCollection.upsert(label._id, label);
  //         this.ctx.logger.info(`Created label ${label.name}`);
  //       }
  //     }
  //     actorLabels.push(...labelIds);
  //   }

  //   for (const image of createdImages) {
  //     if (
  //       (event === "actorCreated" &&
  //         config.matching.applyActorLabels.includes(
  //           ApplyActorLabelsEnum.enum["plugin:actor:create"]
  //         )) ||
  //       (event === "actorCustom" &&
  //         config.matching.applyActorLabels.includes(ApplyActorLabelsEnum.enum["plugin:actor:custom"]))
  //     ) {
  //       await this.ctx.service.image.setLabels(image, actorLabels);
  //     }
  //     // await indexImages([image]);
  //   }

  //   return actor;
  // }
  // public async findUnmatchedScenes(actor: Actor, actorLabels?: string[]): Promise<void> {
  //   const config = getConfig();
  //   // Prevent looping on scenes if we know it'll never be matched
  //   if (
  //     config.matching.matcher.options.ignoreSingleNames &&
  //     !ignoreSingleNames([actor.name]).length
  //   ) {
  //     return;
  //   }

  //   const res = await searchUnmatchedItem(actor, "actors");
  //   if (!res.items.length) {
  //     logger.log(`No unmatched scenes to attach "${actor.name}" to`);
  //     return;
  //   }

  //   const localExtractActors = await buildActorExtractor([actor]);
  //   const matchedScenes: Scene[] = [];

  //   logger.log(`Attaching actor "${actor.name}" labels to ${res.items.length} potential scenes`);
  //   let sceneIterationCount = 0;
  //   const loader = ora(
  //     `Attaching actor "${actor.name}" to unmatched scenes. Checking scenes: ${sceneIterationCount}/${res.items.length}`
  //   ).start();

  //   for (const scene of await Scene.getBulk(res.items)) {
  //     sceneIterationCount++;
  //     loader.text = `Attaching actor "${actor.name}" to unmatched scenes. Checking scenes: ${sceneIterationCount}/${res.items.length}`;
  //     if (localExtractActors(scene.path || scene.name).includes(actor._id)) {
  //       logger.log(`Found scene "${scene.name}"`);
  //       matchedScenes.push(scene);

  //       if (actorLabels?.length) {
  //         await Scene.addLabels(scene, actorLabels);
  //       }

  //       await Scene.addActors(scene, [actor._id]);
  //     }
  //   }

  //   loader.succeed(
  //     `Attached actor "${actor.name}" to ${matchedScenes.length} scenes out of ${res.items.length} potential matches`
  //   );

  //   try {
  //     await indexScenes(matchedScenes);
  //   } catch (error) {
  //     logger.error(error);
  //   }
  //   logger.log(
  //     `Added actor "${actor.name}" ${actorLabels?.length ? "with" : "without"
  //     } labels to scenes : ${JSON.stringify(
  //       matchedScenes.map((s) => s._id),
  //       null,
  //       2
  //     )}`
  //   );
  // }
  public async upsert(_actor: Actor) {
    const actor = this.ctx.repo.Actor.manager.create(Actor, _actor);
    return await this.ctx.repo.Actor.manager.save(actor);
  }
}
