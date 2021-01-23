import { Service } from 'egg';
import { ObjectID } from 'mongodb';
import Label from '../entity/sys/Label';
import LabelledItem from '../entity/sys/LabelledItem';
import { arrayDiff } from '../utils/misc';
export default class LabelService extends Service {
    public async getById(id: string): Promise<Label | undefined> {
        const label = await this.ctx.repo.Label.manager.findOne(Label, id);
        return label;
    }
    public async create(_label: Label | undefined) {
        // const _id = `la_${generateHash()}`;
        const label = this.ctx.repo.Label.manager.create(Label, { ..._label });
        return await this.ctx.repo.Label.manager.save(label);
    }
    public async count() {
        return await this.ctx.repo.Actor.manager.count(Label);
    }
    public async update(id: string, _label: Label) {
        return await this.ctx.repo.Label.manager.update(Label, id, _label);
    }
    public async all(): Promise<Label[]> {
        return await this.ctx.repo.Label.manager.find(Label);
    }
    public async getBulk(_ids: string[]): Promise<Label[]> {
        const ids = _ids.map(id => new ObjectID(id));
        return await this.ctx.repo.Label.findByIds(ids);
    }
    public async addForItem(itemId: string, labelIds: string[], type: string): Promise<void> {
        const oldRefs = await this.service.LabelledItem.getByItem(itemId);
        const { added } = arrayDiff(oldRefs, [...new Set(labelIds)], "label", (l) => l);
        for (const id of added) {
            const labelledItem = {
                item: itemId,
                label: id,
                type
            } as LabelledItem;
            this.ctx.logger.info(`Adding label: ${JSON.stringify(labelledItem)}`);
            await this.service.labelledItem.create(labelledItem);
        }
    }
    public async getForItem(id: string): Promise<Label[]> {
        const references = await this.service.labelledItem.getByItem(id);
        return await this.service.label.getBulk(references.map((r) => r.label));
    }
    public async remove(id: string) {
        return await this.ctx.repo.Label.manager.delete(Label, { id });
    }
    public async setForItem(itemId: string, labelIds: string[], type: string): Promise<void> {
        const oldRefs = await this.service.labelledItem.getByItem(itemId);

        const { removed, added } = arrayDiff(oldRefs, [...new Set(labelIds)], "label", (l) => l);
        const oldRefIds = removed.map(oldRef => oldRef._id);
        await this.service.labelledItem.removes(oldRefIds);
        const labelledItems = added.map(labelId => this.ctx.repo.LabelledItem.manager.create(LabelledItem, { label: labelId, item: itemId, type }));
        await this.service.labelledItem.insert(labelledItems);
    }
}
