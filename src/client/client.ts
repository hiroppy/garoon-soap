import {GaroonError} from "./error";
import Setting from "./setting";
import * as xml from "xml";
import * as xml2js from "xml2js";
import * as processors from "xml2js/lib/processors";
import fetch from "node-fetch";

interface Action {
    [key: string]: any
}

interface Body {
    [index: number]: any
}

interface Envelope {
    Header: any
    Body: Body
}

interface SoapResponse {
    Envelope: Envelope
}

export default class Client {
    private setting: Setting;
    private readonly expires = new Date(Date.UTC(2037, 7, 12, 14, 45, 0));

    public constructor(setting: Setting) {
        this.setting = setting;
    }

    public post(path: string, action: string, parameters: any, preserveChildrenOrder: boolean = false): Promise<Object | void> {
        const actionObject: Action = {};
        actionObject[action] = [{'parameters': parameters}];
        const soapHeaders: Object[] = [
            {'Action': action},
            {
                'Timestamp': [
                    {'Created': this.toISOString(new Date())},
                    {'Expires': this.toISOString(this.expires)}
                ]
            }
        ];
        if (this.doUseWSSecurityAuth()) {
            soapHeaders.push({
                'Security': [{
                    'UsernameToken': [
                        {'Username': this.setting.username},
                        {'Password': this.setting.password}
                    ]
                }]
            });
        }
        if (this.setting.locale !== undefined) {
            soapHeaders.push({
                'Locale': this.setting.locale
            });
        }
        const xmlObject = {
            'soap:Envelope': [
                {
                    '_attr': {'xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope'}
                },
                {
                    'soap:Header': soapHeaders
                },
                {
                    'soap:Body': [actionObject]
                }
            ]
        };
        const xmlString = xml(xmlObject, {declaration: true});
        return fetch(this.setting.baseUrl + path, {
            method: 'POST',
            body: xmlString,
            headers: {
                'Content-Type': 'text/xml; charset=UTF-8'
            },
            // compress: true causes "incorrect header check" error on cybozu.com
            // https://github.com/bitinn/node-fetch/issues/45
            compress: false
        }).then(res => {
            if (res.ok) {
                return res.text();
            } else {
                return Promise.reject(new Error(res.statusText));
            }
        }).then(text => {
            return new Promise((resolve, reject) => {
                xml2js.parseString(text, {
                    trim: true,
                    tagNameProcessors: [processors.stripPrefix],
                    explicitChildren: preserveChildrenOrder,
                    preserveChildrenOrder: preserveChildrenOrder
                }, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        }).then((data: SoapResponse) => {
            if (data['Envelope']['Body'][0]['Fault']) {
                const detail = data['Envelope']['Body'][0]['Fault'][0]['Detail'][0];
                const code = detail['code'][0];
                const diagnosis = detail['diagnosis'][0];
                const cause = detail['cause'][0];
                const counterMeasure = detail['counter_measure'][0];
                const message = `SOAP Request Error! (code: ${code}, diagnosis: ${diagnosis}, cause: ${cause}, counter_measure: ${counterMeasure})`;
                return Promise.reject(new GaroonError({
                    code: code,
                    diagnosis: diagnosis,
                    cause: cause,
                    counterMeasure: counterMeasure
                }, message));
            }
            const responseParam = this.getResponseTag(action);
            if (Array.isArray(data['Envelope']['Body'][0][responseParam])) {
                return data['Envelope']['Body'][0][responseParam][0]['returns'][0];
            }
            // no response
        });
    }

    private pad(number: number): string {
        let str = String(number);
        if (str.length === 1) {
            str = '0' + str;
        }
        return str;
    }

    private toISOString(date: Date): string {
        const year = date.getUTCFullYear();
        const month = this.pad(date.getUTCMonth() + 1);
        const day = this.pad(date.getUTCDate());
        const hour = this.pad(date.getUTCHours());
        const minute = this.pad(date.getUTCMinutes());
        const second = this.pad(date.getUTCSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    }

    private readonly noResponseTags = [
        'ScheduleGetFacilityProfileVersions',
        'ScheduleGetFacilityProfilesById'
    ];

    private getResponseTag(action: string): string {
        if (action.substr(0, 5) === 'Admin') {
            return `${action.substr(5)}Response`
        }
        if (action.substr(0, 4) === 'Util') {
            return `${action.substr(4)}Response`
        }
        if (this.noResponseTags.indexOf(action) >= 0) {
            return action;
        }
        return `${action}Response`;
    }

    private doUseWSSecurityAuth(): boolean {
        return this.setting.username !== undefined && this.setting.password !== undefined;
    }
}
