import * as base from "./base";

export interface CategoryItemsResponse {
    category_item?: base.ItemVersionResultXMLObject[]
}

export interface CategoryType {
    name: string
    description: string
    creatorId: string
    creatorLoginName: string
    creatorDisplayName: string
    createTime: Date
    modifierId: string
    modifierLoginName: string
    modifierDisplayName: string
    modifyTime: Date
    categories: CategoryType[]
    id: string
    code: string
    listIndex: number
    parentId?: string
    parentCode?: string
}

export interface CategoriesXMLObject {
    $: any
    category?: CategoryXMLObject[]
}

export interface CategoryXMLObject {
    $: any
    name: string[]
    description: string[]
    creator_id: string[]
    creator_login_name: string[]
    creator_display_name: string[]
    create_time: string[]
    modifier_id: string[]
    modifier_login_name: string[]
    modifier_display_name: string[]
    modify_time: string[]
    categories?: CategoriesXMLObject[]
}

export interface CategoryInformationXMLObject {
    root: CategoryXMLObject[]
}

export interface SearchOptions {
    text: string
    sensitive?: boolean
    start: Date
    end?: Date
    categoryId?: string
    searchSubCategories?: boolean
    titleSearch?: boolean
    bodySearch?: boolean
    fromSearch?: boolean
    followSearch?: boolean
}

export interface FileType {
    id: string
    name: string
    size: number
    mimeType: string
}

export interface TopicType {
    id: string
    version: string
    subject: string
    isDraft: boolean
    startDatetime?: Date
    endDatetime?: Date
    startIsDatetime?: boolean
    endIsDatetime?: boolean
    canFollow: boolean
    published?: boolean
    unread?: boolean
    expired?: boolean
    categoryId: string
    body: string
    htmlBody?: string
    files: FileType[]
    followId?: string
    followNumber?: string
    creator: base.ChangeLogType
    modifier: base.ChangeLogType
}

export interface FileXMLObject {
    $: any
}

export interface ContentXMLObject {
    $: any
    file?: FileXMLObject[]
}

export interface FollowXMLObject {
    $: any
}

export interface TopicXMLObject {
    $: any
    content: ContentXMLObject[]
    follow: FollowXMLObject[]
    creator: base.ChangeLogXMLObject[]
    modifier: base.ChangeLogXMLObject[]
}

export interface TopicsResponse {
    topic: TopicXMLObject[]
}

export interface CategoriesResponse {
    categories?: CategoryInformationXMLObject[]
}

export interface TopicItemsResponse {
    topic_item?: base.ItemVersionResultXMLObject[]
}