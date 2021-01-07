import { Service } from 'egg';
import Actor from '../entity/sys/Actor'
import { mapAsync } from '../utils/async';
export default class ActorService extends Service {
  public async getById(id: string): Promise<Actor | undefined> {
    const image = await this.ctx.repo.Actor.manager.findOne(Actor, { _id: id })
    return image;
  }
  public async create(image: Actor){
    console.log('create ---')
    const actor = await this.ctx.repo.Actor.manager.create(Actor, image);
    return this.ctx.repo.Actor.manager.save(actor);
   
  }
  public async all() {
    return await this.ctx.repo.Actor.manager.find(Actor);
  }
  public async count() {
    return await this.ctx.repo.Actor.manager.count(Actor);
  }
  public async remove(id: string) {
    await this.ctx.repo.Actor.manager.delete(Actor, { _id: id });
    return true
  }
  public async removes(ids: string[]) {
    await mapAsync(ids, async (id: string) => {
      await this.ctx.repo.Actor.manager.delete(Actor, { _id: id });
    });
  }
}
