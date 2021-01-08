import { Service } from 'egg';
import Label from '../entity/sys/Label'
import LabelledItem from '../entity/sys/labelledItem';
import { arrayDiff } from '../utils/misc';
export default class LabelService extends Service {
    public async create(_label: Label | undefined) {
        const label = await this.ctx.repo.Label.manager.create(Label, _label);
        return this.ctx.repo.Label.manager.save(label);
    }
    public async all(): Promise<Label[]> {
        return await this.ctx.repo.Label.manager.find(Label);
    }
    public async getBulk(_ids: string[]): Promise<Label[]> {
        return await this.ctx.repo.Label.findByIds(_ids);
    }
    public async addForItem(itemId: string, labelIds: string[], type: string): Promise<void> {
        const oldRefs = await this.service.LabelledItem.getByItem(itemId);
        const { added } = arrayDiff(oldRefs, [...new Set(labelIds)], "label", (l) => l);
        for (const id of added) {
            const labelledItem: LabelledItem = {
                item: itemId,
                label: id,
                type
            };
            this.ctx.logger.info(`Adding label: ${JSON.stringify(labelledItem)}`);
            await this.service.labelledItem.create(labelledItem);
        }
    }
    public async getForItem(id: string): Promise<Label[]> {
        const references = await this.service.labelledItem.getByItem(id);
        return await this.service.getBulk(references.map((r) => r.label));
    }
}
