import Client from "./client";
import Setting from "./setting";
import * as BaseConverter from "../converter/base";
import * as base from "../type/base";

export default class Base {
    private client: Client;
    private readonly path: string;

    constructor(setting: Setting) {
        this.client = new Client(setting);
        this.path = setting.needCsp ? '/cbpapi/base/api.csp' : '/cbpapi/base/api';
    }

    public getUsersById(userIds: number[]): Promise<Array<base.UserType>> {
        const parameters: Array<Object> = [];
        userIds.forEach(userId => {
            parameters.push({'user_id': userId});
        });
        return this.client.post(this.path, 'BaseGetUsersById', parameters).then(res => {
            const users: Array<base.UserType> = [];
            res[0]['base:BaseGetUsersByIdResponse'][0]['returns'][0]['user'].forEach((obj: base.UserXMLObject) => {
                users.push(BaseConverter.User.toObject(obj));
            });
            return users;
        });
    }

    public getUsersByLoginName(loginNames: string[]): Promise<Array<base.UserType>> {
        const parameters: Array<Object> = [];
        loginNames.forEach(loginName => {
            parameters.push({'login_name': loginName});
        });
        return this.client.post(this.path, 'BaseGetUsersByLoginName', parameters).then(res => {
            const users: Array<base.UserType> = [];
            res[0]['base:BaseGetUsersByLoginNameResponse'][0]['returns'][0]['user'].forEach((obj: base.UserXMLObject) => {
                users.push(BaseConverter.User.toObject(obj));
            });
            return users;
        });
    }

    public getUserVersions(userItems: base.ItemVersionType[]): Promise<Array<base.ItemVersionResultType>> {
        const parameters: Array<Object> = [];
        userItems.forEach(userItem => {
            parameters.push({
                'user_item': {
                    '_attr': {
                        id: userItem.id,
                        version: userItem.version
                    }
                }
            });
        });
        return this.client.post(this.path, 'BaseGetUserVersions', parameters).then(res => {
            const userVersions: Array<base.ItemVersionResultType> = [];
            res[0]['base:BaseGetUserVersionsResponse'][0]['returns'][0]['user_item'].forEach((obj: base.ItemVersionResultXMLObject) => {
                userVersions.push(BaseConverter.ItemVersionResult.toObject(obj));
            });
            return userVersions;
        });
    }

    public getCalendarEvents(): Promise<Array<base.BaseGetCalendarEventType>> {
        return this.client.post(this.path, 'BaseGetCalendarEvents', []).then(res => {
            const calendarEvents: Array<base.BaseGetCalendarEventType> = [];
            res[0]['base:BaseGetCalendarEventsResponse'][0]['returns'][0]['calendar_event'].forEach((obj: base.BaseGetCalendarEventXMLObject) => {
                calendarEvents.push(BaseConverter.BaseGetCalendarEvent.toObject(obj));
            });
            return calendarEvents;
        });
    }

    public getRegionsList(): Promise<Array<base.RegionType>> {
        return this.client.post(this.path, 'BaseGetRegionsList', []).then(res => {
            const regions: Array<base.RegionType> = [];
            res[0]['base:BaseGetRegionsListResponse'][0]['returns'][0]['region'].forEach((obj: base.RegionXMLObject) => {
                regions.push(BaseConverter.Region.toObject(obj));
            });
            return regions;
        });
    }
}
