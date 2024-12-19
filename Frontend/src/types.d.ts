export interface FormDataType {
    username: string
    pass: string
}

/**
 * login
 */
export interface OnLoginFunction {
    onLogin: () => void
}

interface UserDataLoged {
    id: string
    teacherName: string
    uid: string
    path: string
    subjects: Array<subject>
}

interface subject {
    id: string
    subject: string
}

export interface userCredentials {

    subjects: Array<subject>
    teacherInfo: UserDataLoged

}

/**
 * errors
 */
export interface error {
    error: number
    message: string
}


/**
 * Flag
 */
export interface NavbarProps {
    flag?: boolean
    id?: string
}


/**
 * source
 */
export interface Source {
    source: string
    type: number
}

export interface SourceFieldProps {
    onChange: (newSource: Source) => void,
    onRemove: () => void
    idPrefix: number | string
    level: 'unit' | 'topic' | 'subtopic'
    sourceData: Source
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

export interface ContentFieldProps {
    contentData: Content
    onChange: (newContent: Content) => void
    idPrefix: number
    onRemove: (index: number) => void
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

export interface SubtopicFieldProps {
    subtopicData: Subtopic
    onChange: (newSubtopic: Subtopic) => void
    onRemove: () => void
    idPrefix: number
    subtopicSources: Source[]
    onSubtopicChange: (subtopic: Subtopic) => void
    removedThings: RemovedThings
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

export interface TopicCompFormProps {
    topicData: Topic;
    onChange: (newTopic: Topic) => void;
    onRemove: () => void;
    removedThings: RemovedThings
}

export interface TopicsProps {
    unit: Unit;
    updateUnit: (updatedUnit: Unit) => void;
    removedThings: RemovedThings;
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
    topics: Array<Topic>
    subjectId: string
    teacherUid: string
    relativeId: number
}

export interface UnitCompFormProps {
    isUpdate?: boolean
    unitData?: Unit
}

export type DataSubject = Array<Unit>

/**
 * removed things
 */
export interface RemovedThings {
    topics: string[],
    subtopics: string[],
    content: string[]
}