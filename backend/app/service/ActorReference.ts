import { Service } from 'egg';
import ActorReference from '../entity/sys/ActorReference';


export default class ActorReferenceService extends Service {
    public async create(_actorReference: Partial<ActorReference>) {
        const actorReference = this.ctx.repo.ActorReference.manager.create(ActorReference, _actorReference);
        return await this.ctx.repo.ActorReference.manager.save(actorReference);
    }
    public async getByItem(item: string): Promise<ActorReference[]> {
        return await this.ctx.repo.ActorReference.find({ item });
    }
    public async getByActor(actor: string): Promise<ActorReference[]> {
        return await this.ctx.repo.ActorReference.find({ actor: actor });
    }
    public async insert(_actorReference: ActorReference | ActorReference[]) {
        if (Array.isArray(_actorReference) && _actorReference.length === 0) return;
        await this.ctx.repo.LabelledItem.manager.insert(ActorReference, _actorReference);
    }
}