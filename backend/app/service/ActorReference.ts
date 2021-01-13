import { Service } from 'egg';
import ActorReference from '../entity/sys/ActorReference';


export default class ActorReferenceService extends Service {
    public async create(_actorReference: Partial<ActorReference>) {
        const actorReference = this.ctx.repo.ActorReference.manager.create(ActorReference, _actorReference);
        return await this.ctx.repo.ActorReference.manager.save(actorReference);
    }
    public async getByItem(id: string): Promise<ActorReference[]> {
        return [];
    }
}