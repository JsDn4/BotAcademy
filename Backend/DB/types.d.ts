import { relative } from 'path';
/**
 * error
 */
export type errorType = {
    id: number,
    message: string
}

/**
 * subjects
 */
export interface subjectType {
    id: string,
    subject: string
}

export type subjectTypeArray = Array<subjectType>

/**
 * teacher
 */
export interface teacherInfo {
    id: string,
    teacherName: string,
    uid: string,
    path: string
    subjects: string[]
}

export type teacherInfoArray = Array<teacherInfo>

/**
 * login
 */
export type loginInfo = {
    uid: string
}

/**
 * units
 */
interface sourcesType {
    type: number
    source: string
}

export interface unit {
    id: string
    description: string
    unitNumber: number
    sources: Array<sourcesType>
    unitTitle: string
    subjectId: string
    teacherUid: string
    relativeId: number
}

export type unitsInfo = Array<unit>

/**
 * topics
 */
interface topic {
    id: string
    topicTitle: string
    unitId: string
    topicNumber: number
    sources: Array<sourcesType>
    description: string
}

export type topicsInfo = Array<topic>

/**
 * subtopics
 */
interface subtopic {
    id: string
    description: string
    sources: Array<sourcesType>
    subtopicNumber: number
    subtopicTitle: string
    topicId: string
}

export type subtopicsInfo = Array<subtopic>

/**
 * content
 */
interface content {
    contentNumber: number
    contentTitle: string
    description: string
    image: string
    subtopicId: string
    type: number
    url: string
}

export type contentInfo = Array<content>

/**
 * Create Unit Types
 */

/**
 * source
 */
export interface Source {
    source: string
    type: number
}

/**
 * Content
 */
export interface Content {
    id: string
    contentNumber: number
    contentTitle: string
    description: string
    image: string
    subtopicId: string
    type: number
    url: string
    relativeId: number
}


/**
 * Subtopic
 */
export interface Subtopic {
    id: string
    description: string
    sources: Array<Source>
    subtopicNumber: number
    subtopicTitle: string
    topicId: string
    content: Array<Content>
    relativeId: number
}

/**
 * Topic
 */
export interface Topic {
    id: string
    topicTitle: string
    unitId: string
    topicNumber: number
    sources: Array<Source>
    description: string
    subtopics: Array<Subtopic>
    relativeId: number
}

/**
 * Unit
 */
export interface Unit {
    id: string
    description: string
    unitNumber: number
    sources: Array<Source>
    unitTitle: string
    topics?: Array<Topic>
    relativeId: number,
    subjectId?: string,
    teacherUid?: string
}

/**
 * removed things
 */

export interface RemovedThings {
    topics: string[],
    subtopics: string[],
    content: string[]
}