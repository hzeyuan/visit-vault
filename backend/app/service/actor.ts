import { Service } from 'egg';
import { FindManyOptions } from 'typeorm';
import Actor from '../entity/sys/Actor'
import { ObjectID } from 'mongodb';
import ActorReference from '../entity/sys/ActorReference';
import { mapAsync } from '../utils/async';
import { arrayDiff } from '../utils/misc';



export default class ActorService extends Service {
  // 获取作者的id
  public async getById(id: string): Promise<Maybe<Actor>> {
    const actor = await this.ctx.repo.Actor.manager.findOne(Actor, id)
    return typeof actor !== 'undefined' ? actor : null;
  }
  // 创建应用
  public async upsert(_actor: Actor) {
    const actor = this.ctx.repo.Actor.manager.create(Actor, _actor);
    return await this.ctx.repo.Actor.manager.save(actor);
  }
  public async getPage(page: number | undefined, skip: number | undefined, take: number | undefined) {
    const pageSize = getPageSize(take);
    return await this.ctx.repo.Actor.manager.find(Actor, { skip: skip || Math.max(0, +(page || 0) * pageSize), take } as FindManyOptions);
  }
  // 获取全部作者
  public async all(): Promise<Actor[]> {
    return await this.ctx.repo.Actor.manager.find(Actor);
  }
  // 获取作者数量
  public async count() {
    return await this.ctx.repo.Actor.manager.count(Actor);
  }
  // 删除作者
  public async remove(actor: Actor | null) {
    if (!actor) return false;
    await this.ctx.repo.Actor.manager.delete(Actor, { _id: actor._id });
    // 删除对应作者的标签
    await this.ctx.service.labelledItem.removeByItem(actor._id);
    // 删除对应作者的关联图片。
    await this.ctx.service.actorReference.removeByItem(actor._id);
    return true
  }
  // 批量获取作者
  public async getBulk(_ids: string[]): Promise<Actor[]> {
    const ids = _ids.map(id => new ObjectID(id));
    return await this.ctx.repo.Actor.findByIds(ids);
  }

  // 批量删除作者
  public async removes(ids: string[]) {
    await mapAsync(ids, async (id: string) => {
      await this.ctx.repo.Actor.manager.delete(Actor, { _id: id });
    });
  }
  // 获取作者对应的标签
  public async getLabels(actor: Actor): Promise<Label[]> {
    return await this.ctx.service.label.getForItem(actor._id);
  }
  // 设置作者对应的标签
  public async setLabels(actor: Actor, labelIds: string[]) {
    if (labelIds.length == 0) return [];
    // 为actor设置标签
    await this.service.label.setForItem(actor._id, labelIds, "actor");
    return await this.ctx.service.actor.getLabels(actor);
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
    await this.service.actorReference.addBulk(labelledItems);
  }


}
