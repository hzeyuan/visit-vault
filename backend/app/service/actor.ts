import { Service } from 'egg';
import { FindManyOptions } from 'typeorm';
import Actor from '../entity/sys/Actor'
import { ObjectID } from 'mongodb';
import ActorReference from '../entity/sys/ActorReference';
import { mapAsync } from '../utils/async';
import { arrayDiff } from '../utils/misc';

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
    const actor = this.ctx.repo.Actor.manager.create(Actor, _actor);
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
  public async remove(actor: Actor | null) {
    if (!actor) return false;
    await this.ctx.repo.Actor.manager.delete(Actor, { _id: actor._id });
    // 删除对应作者的标签
    await this.ctx.service.labelledItem.removeByItem(actor._id);
    // 删除对应作者的关联图片。
    await this.ctx.service.actorReference.removeByItem(actor._id);

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
    // 为actor设置标签
    await this.service.label.setForItem(actor._id, labelIds, "actor");
    return await this.ctx.service.actor.getLabels(actor);
  }
  public async upsert(_actor: Actor) {
    const actor = this.ctx.repo.Actor.manager.create(Actor, _actor);
    return await this.ctx.repo.Actor.manager.save(actor);
  }
}
