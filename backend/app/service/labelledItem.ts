import { Service } from 'egg';
import LabelledItem from '../entity/sys/LabelledItem'
export default class LabelItemService extends Service {

    public async create(_labelledItem: LabelledItem | undefined) {
        const labelledItem = await this.ctx.repo.LabelledItem.manager.create(LabelledItem, _labelledItem);
        return this.ctx.repo.LabelledItem.manager.save(labelledItem);
    }
    public async getAll(): Promise<LabelledItem[]> {
        return await this.ctx.repo.LabelledItem.manager.find(LabelledItem);
    }
    public async getByItem(item: string): Promise<LabelledItem[]> {
        return await this.ctx.repo.LabelledItem.manager.find(LabelledItem, { item })
    }
    public async getByLabel(label: string): Promise<LabelledItem[]> {
        return await this.ctx.repo.LabelledItem.manager.find(LabelledItem, { label })
    }
    public async getByType(type: string): Promise<LabelledItem[]> {
        return await this.ctx.repo.LabelledItem.manager.find(LabelledItem, { type })
    }

}
