import { Service } from 'egg';

export default class SearchService extends Service {
    // 过滤作者
    public async actorsFilters(actors?: string[] | null) {
        const actorRef = await this.ctx.repo.ActorReference.find({
            where: { actor: { $in: actors } },
        });
        const imageIds = actorRef.map(actor => actor.item);
        return actors && actors.length > 0 ? {
            where: { _id: { $in: imageIds } },
        } : {}
    }
    // 过滤作者
    public async labelsFilters(labels?: string[] | null) {
        if (!labels) return {};
        const labelRef = await this.ctx.repo.LabelledItem.find({
            where: { label: { $in: labels } },
        });
        const imageIds = labelRef.map(label => label.item);
        return labels.length > 0 ? {
            where: { _id: { $in: imageIds } },
        } : {}
    }
    // 过滤评分
    public ratingFilters(rate?: number | null, key: 'eq' | 'lt' | 'lg' = 'eq') {
        return rate ? {
            where: {
                rating: { [`$${key}`]: rate }
            },
        } : {}
    }
    // 过滤收藏
    public bookmarkFilters(bookmark?: boolean | null) {
        return bookmark ? {
            where: {
                bookmark:
                    { $not: { $eq: null } }
            }
            ,
        } : {}
    }
    // 过滤喜欢
    public favoriteFilters(favorite?: boolean | null) {
        return favorite ? {
            where: {
                favorite:
                    { $eq: favorite }
            },
        } : {}
    }
    // 顺序
    public sortBy(key?: string | null, direction?: string | null) {
        let order = {}
        const sortOrder = direction === 'asc' ? 1 : -1;
        switch (key) {
            case 'relevance':
                break;
            case 'addedOn':
                order = { order: { addedOn: sortOrder } }
                break;
            case 'rating':
                order = { order: { rating: sortOrder } }
                break;
            case 'bookmark':
                order = { order: { bookmark: sortOrder } }
                break;
            case 'random':
                break;
            default:
                break;
        }
        return order;
    }
}