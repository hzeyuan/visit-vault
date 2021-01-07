import { Service } from 'egg';
import Scene from '../entity/sys/Scene'
import { mapAsync } from '../utils/async';
export default class SceneService extends Service {
  public async getById(id: string): Promise<Scene | undefined> {
    const scene = await this.ctx.repo.Scene.manager.findOne(Scene, { _id: id })
    return scene;
  }
  public async create(scene: Scene){
    console.log('create ---')
    const actor = await this.ctx.repo.Scene.manager.create(Scene, scene);
    return this.ctx.repo.Scene.manager.save(actor);
   
  }
  public async all() {
    return await this.ctx.repo.Scene.manager.find(Scene);
  }
  public async count() {
    return await this.ctx.repo.Scene.manager.count(Scene);
  }
  public async remove(id: string) {
    await this.ctx.repo.Scene.manager.delete(Scene, { _id: id });
    return true
  }
  public async removes(ids: string[]) {
    await mapAsync(ids, async (id: string) => {
      await this.ctx.repo.Scene.manager.delete(Scene, { _id: id });
    });
  }
}
