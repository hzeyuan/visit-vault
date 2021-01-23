import { Service } from 'egg';
import LabelledItem from '../entity/sys/LabelledItem'
import { mapAsync } from '../utils/async';
export default class LabelItemService extends Service {

    public async create(_labelledItem: LabelledItem | undefined) {
        const labelledItem = this.ctx.repo.LabelledItem.manager.create(LabelledItem, { ..._labelledItem });
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
    public async remove(itemId: string, labelId: string): Promise<boolean> {
        this.ctx.repo.LabelledItem.manager.delete(LabelledItem, { item: itemId, label: labelId }).catch(() => {
            return false
        });
        return true;
    }
    public async removes(ids: string[]) {
        await mapAsync(ids, async (id: string) => {
            console.log('id', id.toString());
            await this.ctx.repo.LabelledItem.manager.delete(LabelledItem, { _id: id.toString() });
        });
    }
    public async insert(_labelledItem: LabelledItem | LabelledItem[]) {
        if (Array.isArray(_labelledItem) && _labelledItem.length === 0) return;
        await this.ctx.repo.LabelledItem.manager.insert(LabelledItem, _labelledItem);
    }
    public async removeByLabel(id: string) {

    }
    public async removeById(id: string): Promise<void> {
        await this.ctx.repo.LabelledItem.manager.delete(LabelledItem, { id });
    }
    public async removeByItem(id: string) {
        for (const ref of await this.getByItem(id)) {
            await this.removeById(ref._id);
        }
    }
}
