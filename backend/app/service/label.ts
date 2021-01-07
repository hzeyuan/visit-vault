import { Service } from 'egg';
import Label from '../entity/sys/Label'
import { mapAsync } from '../utils/async';
export default class LabelService extends Service {
  public async getById(id: string): Promise<Label | undefined> {
    const label = await this.ctx.repo.Label.manager.findOne(Label, { _id: id })
    return label;
  }
  public async create(label: Label){
    console.log('create ---')
    const actor = await this.ctx.repo.Label.manager.create(Label, label);
    return this.ctx.repo.Label.manager.save(actor);
   
  }
  public async all() {
    return await this.ctx.repo.Label.manager.find(Label);
  }
  public async count() {
    return await this.ctx.repo.Label.manager.count(Label);
  }
  public async remove(id: string) {
    await this.ctx.repo.Label.manager.delete(Label, { _id: id });
    return true
  }
  public async removes(ids: string[]) {
    await mapAsync(ids, async (id: string) => {
      await this.ctx.repo.Label.manager.delete(Label, { _id: id });
    });
  }
}
