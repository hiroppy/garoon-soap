import Client from "./client";
import Setting from "./setting";
import * as base from "../type/base";
import * as bulletin from "../type/bulletin";
import * as BaseConverter from "../converter/base";
import * as BulletinConverter from "../converter/bulletin";
import * as datetime from "../util/datetime";

export default class Bulletin {
    private client: Client;
    private readonly path: string;

    constructor(setting: Setting) {
        this.client = new Client(setting);
        this.path = setting.needCsp ? '/cbpapi/bulletin/api.csp' : '/cbpapi/bulletin/api';
    }

    public getCategoryVersions(categoryItems: base.ItemVersionType[]): Promise<base.ItemVersionResultType[]> {
        const parameters: Object[] = [];
        categoryItems.forEach(categoryItem => {
            parameters.push({
                'category_item': {
                    '_attr': {
                        id: categoryItem.id,
                        version: categoryItem.version
                    }
                }
            });
        });
        return this.client.post(this.path, 'BulletinGetCategoryVersions', parameters).then((res: bulletin.CategoryItemsResponse) => {
            const categoryVersions: base.ItemVersionResultType[] = [];
            if (res.category_item !== undefined) {
                res.category_item.forEach(obj => {
                    categoryVersions.push(BaseConverter.ItemVersionResult.toObject(obj));
                });
            }
            return categoryVersions;
        });
    }

    public getCategories(): Promise<bulletin.CategoryType|null> {
        return this.client.post(this.path, 'BulletinGetCategories', []).then((res: bulletin.CategoriesResponse) => {
            if (res.categories !== undefined) {
                return BulletinConverter.Category.toObject(res.categories[0].root[0]);
            }
            return null;
        });
    }

    public getTopicVersions(start: Date, end?: Date, topicItems?: base.ItemVersionType[], categoryIds?: string[]): Promise<base.ItemVersionResultType[]> {
        const parameters: Object[] = [];
        const attr: any = {
            start: datetime.toString(start)
        };
        if (end !== undefined) {
            attr.end = datetime.toString(end);
        }
        parameters.push({_attr: attr});

        if (topicItems !== undefined) {
            topicItems.forEach(topicItem => {
                parameters.push({
                    topic_item: {
                        _attr: {
                            id: topicItem.id,
                            version: topicItem.version
                        }
                    }
                });
            });
        }

        if (categoryIds !== undefined) {
            categoryIds.forEach(categoryId => {
                parameters.push({category_id: categoryId});
            });
        }

        return this.client.post(this.path, 'BulletinGetTopicVersions', parameters).then((res: bulletin.TopicItemsResponse) => {
            const topicVersions: base.ItemVersionResultType[] = [];
            if (res.topic_item !== undefined) {
                res.topic_item.forEach(obj => {
                    topicVersions.push(BaseConverter.ItemVersionResult.toObject(obj));
                });
            }
            return topicVersions;
        });
    }
}
