import { Service } from 'egg';
import Label from '../entity/sys/label'
import TLabel from '../types/label';
export default class LabelService extends Service {
    public async getById(id: string): Promise<Label | undefined> {
        const Label = await this.ctx.repo.Label.createQueryBuilder('label').where('Label._id = :id', { id }).getOne();
        return Label;
    }
    public async create(label: TLabel | Label) {

        console.log('create ---')

        // this.ctx.ormManage
        // {
        //   _id: '1',
        //   addedOn: 'addedOn',
        //   favorite: true,
        //   customFields: '',
        //   name: '图片',
        //   path: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa0.att.hudong.com%2F52%2F62%2F31300542679117141195629117826.jpg&refer=http%3A%2F%2Fa0.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1611576383&t=63182d5eb71da0dc476244c3a9ceb76e',
        //   Labels: '',
        //   thumbPath: '',
        //   scene: '',
        //   bookmark: 1,
        //   rating: 5,
        //   meta: '',
        //   studio: '',
        //   hash: '',
        //   color: '',
        // }
        const res = await this.ctx.repo.Label.createQueryBuilder('label').insert().into(Label)
            .values(label as Label).execute();
        this.logger.debug('res', res);
    }
    public async all() {
        return await this.ctx.repo.Image.createQueryBuilder('label').getManyAndCount();
    }
}
