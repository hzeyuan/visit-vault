import { Service } from 'egg';
import ActorReference from '../entity/sys/ActorReference';


export default class ActorReferenceService extends Service {
    public async upsert(_actorReference: Partial<ActorReference>) {
        const actorReference = this.ctx.repo.ActorReference.manager.create(ActorReference, _actorReference);
        return await this.ctx.repo.ActorReference.manager.save(actorReference);
    }
    public async addBulk(_actorReference: ActorReference | ActorReference[]) {
        if (Array.isArray(_actorReference) && _actorReference.length === 0) return;
        await this.ctx.repo.LabelledItem.manager.insert(ActorReference, _actorReference);
    }
    public async getByItem(itemID: string): Promise<ActorReference[]> {
        return await this.ctx.repo.ActorReference.find({ item: itemID });
    }
    public async getByActor(actorID: string): Promise<ActorReference[]> {
        return await this.ctx.repo.ActorReference.find({ actor: actorID });
    }

    public async removeById(id: string): Promise<void> {
        await this.ctx.repo.ActorReference.manager.delete(ActorReference, { id });
    }
    public async removeByItem(id: string) {
        for (const ref of await this.getByItem(id)) {
            await this.removeById(ref._id);
        }
    }
}