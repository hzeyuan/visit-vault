import { Service } from 'egg';
import ActorReference from '../entity/sys/ActorReference';


export default class ActorReferenceService extends Service {

    public async getByItem(id: string): Promise<ActorReference[]> {
        return [];
    }
}