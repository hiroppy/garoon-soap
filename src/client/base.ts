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

    public getUsersById(userIds: string[]): Promise<base.UserType[]> {
        const parameters: Object[] = [];
        userIds.forEach(userId => {
            parameters.push({'user_id': userId});
        });
        return this.client.post(this.path, 'BaseGetUsersById', parameters).then((res: base.UsersResponse) => {
            const users: base.UserType[] = [];
            res['user'].forEach((obj: base.UserXMLObject) => {
                users.push(BaseConverter.User.toObject(obj));
            });
            return users;
        });
    }

    public getUsersByLoginName(loginNames: string[]): Promise<base.UserType[]> {
        const parameters: Object[] = [];
        loginNames.forEach(loginName => {
            parameters.push({'login_name': loginName});
        });
        return this.client.post(this.path, 'BaseGetUsersByLoginName', parameters).then((res: base.UsersResponse) => {
            const users: base.UserType[] = [];
            res['user'].forEach(obj => {
                users.push(BaseConverter.User.toObject(obj));
            });
            return users;
        });
    }

    public getUserVersions(userItems: base.ItemVersionType[]): Promise<base.ItemVersionResultType[]> {
        const parameters: Object[] = [];
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
        return this.client.post(this.path, 'BaseGetUserVersions', parameters).then((res: base.UserItemsResponse) => {
            const userVersions: base.ItemVersionResultType[] = [];
            res['user_item'].forEach(obj => {
                userVersions.push(BaseConverter.ItemVersionResult.toObject(obj));
            });
            return userVersions;
        });
    }

    public getCalendarEvents(): Promise<base.BaseGetCalendarEventType[]> {
        return this.client.post(this.path, 'BaseGetCalendarEvents', []).then((res: base.CalendarEventsResponse) => {
            const calendarEvents: base.BaseGetCalendarEventType[] = [];
            res['calendar_event'].forEach(obj => {
                calendarEvents.push(BaseConverter.BaseGetCalendarEvent.toObject(obj));
            });
            return calendarEvents;
        });
    }

    public getRegionsList(): Promise<base.RegionType[]> {
        return this.client.post(this.path, 'BaseGetRegionsList', []).then((res: base.RegionsResponse) => {
            const regions: base.RegionType[] = [];
            res['region'].forEach(obj => {
                regions.push(BaseConverter.Region.toObject(obj));
            });
            return regions;
        });
    }

    public getTimezoneVersion(): Promise<string> {
        return this.client.post(this.path, 'BaseGetTimezoneVersion', []).then((res: base.TimezoneVersionResponse) => {
            return res['timezone_version'][0];
        });
    }

    public getApplicationStatus(): Promise<base.BaseApplicationType[]> {
        return this.client.post(this.path, 'BaseGetApplicationStatus', []).then((res: base.ApplicationStatusResponse) => {
            const applications: base.BaseApplicationType[] = [];
            res['application'].forEach(obj => {
                applications.push(BaseConverter.Application.toObject(obj));
            });
            return applications;
        });
    }

    public getApplicationInformation(): Promise<base.BaseApplicationInformationType[]> {
        return this.client.post(this.path, 'BaseGetApplicationInformation', []).then((res: base.ApplicationInformationResponse) => {
            const applications: base.BaseApplicationInformationType[] = [];
            res['application'].forEach(obj => {
                applications.push(BaseConverter.ApplicationInformation.toObject(obj));
            });
            return applications;
        });
    }

    public manageApplication(applications: base.BaseManagerApplicationType[]): Promise<base.BaseApplicationType[]> {
        const parameters: Object[] = [];
        applications.forEach(application => {
            parameters.push({
                'application': {
                    '_attr': {
                        code: application.code,
                        active: application.active
                    }
                }
            })
        });
        return this.client.post(this.path, 'BaseManagerApplication', parameters).then((res: base.ApplicationStatusResponse) => {
            const applications: base.BaseApplicationType[] = [];
            res['application'].forEach(obj => {
                applications.push(BaseConverter.Application.toObject(obj));
            });
            return applications;
        });
    }

    public getOrganizationVersions(orgItems: base.ItemVersionType[]): Promise<base.ItemVersionResultType[]> {
        const parameters: Object[] = [];
        orgItems.forEach(orgItem => {
            parameters.push({
                'organization_item': {
                    '_attr': {
                        id: orgItem.id,
                        version: orgItem.version
                    }
                }
            });
        });
        return this.client.post(this.path, 'BaseGetOrganizationVersions', parameters).then((res: base.OrgItemsResponse) => {
            const orgVersions: base.ItemVersionResultType[] = [];
            res['organization_item'].forEach(obj => {
                orgVersions.push(BaseConverter.ItemVersionResult.toObject(obj));
            });
            return orgVersions;
        });
    }

    public getOrganizationsById(orgIds: string[]): Promise<base.OrganizationType[]> {
        const parameters: Object[] = [];
        orgIds.forEach(orgId => {
            parameters.push({'organization_id': orgId})
        });
        return this.client.post(this.path, 'BaseGetOrganizationsById', parameters).then((res: base.OrganizationsResponse) => {
            const orgs: base.OrganizationType[] = [];
            res['organization'].forEach(org => {
                orgs.push(BaseConverter.Organization.toObject(org));
            });
            return orgs;
        });
    }

    public getMyGroupVersions(myGroupItems: base.ItemVersionType[]): Promise<base.ItemVersionResultType[]> {
        const parameters: Object[] = [];
        myGroupItems.forEach(myGroupItem => {
            parameters.push({
                'my_group_item': {
                    '_attr': {
                        id: myGroupItem.id,
                        version: myGroupItem.version
                    }
                }
            })
        });
        return this.client.post(this.path, 'BaseGetMyGroupVersions', parameters).then((res: base.MyGroupItemsResponse) => {
            const myGroupVersions: base.ItemVersionResultType[] = [];
            res['my_group_item'].forEach(obj => {
                myGroupVersions.push(BaseConverter.ItemVersionResult.toObject(obj));
            });
            return myGroupVersions;
        });
    }

    public getMyGroupsById(groupIds: string[]): Promise<base.MyGroupType[]> {
        const parameters: Object[] = [];
        groupIds.forEach(groupId => {
            parameters.push({'my_group_id': groupId});
        });
        return this.client.post(this.path, 'BaseGetMyGroupsById', parameters).then((res: base.MyGroupsResponse) => {
            const myGroups: base.MyGroupType[] = [];
            res['my_group'].forEach(myGroup => {
                myGroups.push(BaseConverter.MyGroup.toObject(myGroup));
            });
            return myGroups;
        });
    }
}
