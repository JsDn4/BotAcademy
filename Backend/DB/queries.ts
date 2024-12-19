import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    where
} from "firebase/firestore";

import { db } from "./connection";

import {
    Content,
    contentInfo,
    errorType,
    RemovedThings,
    Source,
    subjectType,
    Subtopic,
    subtopicsInfo,
    teacherInfo,
    Topic,
    topicsInfo,
    Unit,
    type unitsInfo
} from './types';


/**
 * GET Functions 
 */

/**
 * 
 * @param id subject id 
 */
export const getSubjects = async (id: string) => {
    try {

        const subjectsRef = await collection(db, 'subjects')

        const q = doc(subjectsRef, id)

        const querySnapshot = await getDoc(q)

        const data: subjectType = {
            id: querySnapshot.id,
            subject: querySnapshot.data()?.subject as string
        }

        return data;

    } catch (error) {

        // const err: errorType = {
        //     id: -1,
        //     message: 'Lo siento ha ocurrido un error en la obtención de materias'
        // }

        // return err

        const data: subjectType = {

            id: '',
            subject: ''

        }

        return data



    }
}

/**
 * 
 * @param uid user uid
 */

export const getTeacherInfo = async (uid: string) => {

    try {

        const teachersCollectionRef = await collection(db, 'teachers')

        const q = await query(teachersCollectionRef,
            where('uid', '==', uid))

        const querySnapshot = await getDocs(q)


        const item = await querySnapshot.docs[0]

        const data: teacherInfo = {
            id: item.id as string,
            teacherName: item.data().teacherName as string,
            uid: item.data().uid as string,
            path: item.ref.path as string,
            subjects: item.data().subjects
        }

        return data;

    } catch (error) {

        const data: teacherInfo = {
            id: '',
            teacherName: '',
            uid: '',
            path: '',
            subjects: ['']
        }

        return data;

    }

}

/**
 * 
 * @param uid user uid
 * @param subjectId subject id
 */

export const getUnits = async (uid: string, subjectId: string) => {


    try {

        const unitsCollectionRef = await collection(db, 'units')

        const qUnits = await query(unitsCollectionRef,
            where('subjectId', '==', subjectId),
            where('teacherUid', '==', uid),
            orderBy('unitNumber', 'asc')
        )


        const querySnapshotUnits = await getDocs(qUnits);

        const data: unitsInfo = querySnapshotUnits.docs.map(item => {
            return {
                id: item.id as string,
                description: item.data().description as string,
                unitNumber: Number(item.data().unitNumber) as number,
                sources: item.data().sources,
                unitTitle: item.data().unitTitle as string,
                subjectId: item.data().subjectId as string,
                teacherUid: item.data().teacherUid as string,
                relativeId: Number(item.data().relativeId) as number
            }
        })

        return data
    } catch (error) {

        const err: errorType = {
            id: -1,
            message: 'Ha ocurrido un error al obtener las unidades'
        }

        return err

    }

}


export const getUnitById = async (id: string) => {

    try {

        const unitRef = await collection(db, 'units')

        const q = await doc(unitRef, id)

        const querySnapshot = await getDoc(q)

        const data: Unit = {
            id: querySnapshot.id,
            description: querySnapshot.data()?.description as string,
            sources: querySnapshot.data()?.sources as Array<Source>,
            unitNumber: Number(querySnapshot.data()?.unitNumber) as number,
            unitTitle: querySnapshot.data()?.unitTitle as string,
            subjectId: querySnapshot.data()?.subjectId as string,
            teacherUid: querySnapshot.data()?.teacherUid as string,
            relativeId: Number(querySnapshot.data()?.relativeId) as number,
            topics: [],
        }

        return data

    }
    catch (error) {
        const err: errorType = {
            id: -1,
            message: 'Ha ocurrido un error al obtener la unidad '
        }

        return err

    }


}

/**
 * 
 * @param id unit id
 * @returns topics array
 */
export const getTopics = async (id: string) => {

    try {

        const topicRef = await collection(db, 'topics')

        const q = await query(topicRef,
            where('unitId', '==', id),
            orderBy('relativeId', 'asc')
        )

        const querySnapshot = await getDocs(q)

        const data: topicsInfo = querySnapshot.docs.map(item => {
            return {
                id: item.id as string,
                topicTitle: item.data().topicTitle as string,
                unitId: item.data().unitId as string,
                topicNumber: Number(item.data().topicNumber) as number,
                sources: item.data().sources,
                description: item.data().description as string,
                relativeId: item.data().relativeId as number
            }
        })

        return data

    } catch (error) {

        const err: errorType = {
            id: -1,
            message: 'Ha ocurrido un error al obtener temas'
        }

        return err

    }

}

/**
 * 
 * @param id topic id
 * @returns subtopics array
 */
export const getSubtopics = async (id: string) => {

    try {

        const subtopicsRef = await collection(db, 'subtopics')
        const q = query(subtopicsRef,
            where('topicId', '==', id),
        )

        const querySnapshot = await getDocs(q)

        const data: subtopicsInfo = querySnapshot.docs.map(item => {
            return {
                id: item.id as string,
                description: item.data().description as string,
                sources: item.data().sources,
                subtopicNumber: Number(item.data().subtopicNumber) as number,
                subtopicTitle: item.data().subtopicTitle as string,
                topicId: item.data().topicId as string,
                relativeId: Number(item.data().relativeId) as number
            }
        })

        return data

    } catch (error) {

        const err: errorType = {
            id: -1,
            message: 'Ha ocurrido un error al obtener sub temas'
        }

        return err

    }

}
/**
 * 
 * @param id subtopic id
 * @returns content array
 */
export const getContent = async (id: string) => {

    try {

        const contentRef = await collection(db, 'content')
        const q = await query(contentRef,
            where('subtopicId', '==', id),
        )
        const querySnapshot = await getDocs(q)

        const data: contentInfo = querySnapshot.docs.map(item => {
            return {
                id: item.id,
                contentNumber: Number(item.data().contentNumber) as number,
                contentTitle: item.data().contentTitle as string,
                description: item.data().description as string,
                image: item.data().image as string,
                subtopicId: item.data().subtopicId as string,
                type: Number(item.data().type) as number,
                url: item.data().url as string,
                relativeId: Number(item.data().relativeId) as number
            }
        })

        return data

    } catch (error) {
        const err: errorType = {
            id: -1,
            message: 'Ha ocurrido un error al obtener los contenidos'
        }

        return err

    }

}

/**
 * Create Unit Function
 */

/**
 * 
 * @param uid user uid
 * @param subjectId subject id
 * @param unit unit object
 * @returns string | void
 */
export const createCompleteUnit = async (uid: string, subjectId: string, unit: Unit) => {

    try {

        //Ref to units collection
        const unitsRef = await collection(db, 'units')

        //Query to get the last unit number by relativeId

        const q = query(
            unitsRef,
            orderBy(
                'relativeId',
                'desc'
            ),
            limit(1)
        )

        const relativeIdUnit = await getDocs(q)

        //Add unit to unit collection
        await addDoc(unitsRef, {
            description: unit.description,
            sources: unit.sources,
            subjectId: subjectId,
            teacherUid: uid,
            unitNumber: unit.unitNumber,
            unitTitle: unit.unitTitle,
            relativeId: relativeIdUnit.docs[0].data().relativeId + 1
        }).then(async (docRef) => {

            if (!unit.topics || unit.topics.length === 0) return 'Data added successfully'

            //Ref to topics collection
            const topicsRef = await collection(db, 'topics')

            //Query to get the last topic number by relativeId

            const q = query(
                topicsRef,
                orderBy(
                    'relativeId',
                    'desc'
                ),
                limit(1)
            )

            const relativeIdTopic = await getDocs(q)



            //Add topics to topics collection
            for (const topic of unit.topics) {

                await addDoc(topicsRef, {
                    description: topic.description,
                    sources: topic.sources,
                    topicNumber: topic.topicNumber,
                    topicTitle: topic.topicTitle,
                    unitId: docRef.id,
                    relativeId: relativeIdTopic.docs[0].data().relativeId + 1
                }).then(async (docRef) => {

                    if (topic.subtopics.length === 0) return 'Data added successfully'

                    //Ref to subtopics collection
                    const subtopicsRef = await collection(db, 'subtopics')

                    //Query to get the last subtopic number by relativeId

                    const q = query(
                        subtopicsRef,
                        orderBy(
                            'relativeId',
                            'desc'
                        ),
                        limit(1)
                    )

                    const relativeIdSubtopic = await getDocs(q)

                    //Add subtopics to subtopics collection
                    for (const subtopic of topic.subtopics) {

                        await addDoc(subtopicsRef, {
                            description: subtopic.description,
                            sources: subtopic.sources,
                            subtopicNumber: subtopic.subtopicNumber,
                            subtopicTitle: subtopic.subtopicTitle,
                            topicId: docRef.id,
                            relativeId: relativeIdSubtopic.docs[0].data().relativeId + 1
                        }).then(async (docRef) => {

                            if (subtopic.content.length === 0) return 'Data added successfully'
                            //Ref to content collection
                            const contentRef = await collection(db, 'content')

                            //Query to get the last content number by relativeId

                            const q = query(
                                contentRef,
                                orderBy(
                                    'relativeId',
                                    'desc'
                                ),
                                limit(1)
                            )

                            const relativeIdContent = await getDocs(q)

                            //Add content to content collection
                            for (const content of subtopic.content) {

                                await addDoc(contentRef, {
                                    contentNumber: content.contentNumber,
                                    contentTitle: content.contentTitle,
                                    description: content.description,
                                    image: content.image,
                                    subtopicId: docRef.id,
                                    type: content.type,
                                    url: content.url,
                                    relativeId: relativeIdContent.docs[0].data().relativeId + 1
                                })

                            }

                        })

                    }

                })

            }

        })

        return 'Data added successfully'

    } catch (error) {

        const err: errorType = {
            id: -1,
            message: 'Ha ocurrido un error al obtener los contenidos'
        }

        return err

    }


}

/**
 * Remove Functions
 */

export const removeUnit = async (unitId: string) => {

    try {

        const unitRef = await collection(db, 'units')
        const topicRef = await collection(db, 'topics')
        const subtopicRef = await collection(db, 'subtopics')
        const contentRef = await collection(db, 'content')

        //Get topics to remove
        const qTopics = await query(topicRef,
            where('unitId', '==', unitId)
        )

        const querySnapshotTopics = await getDocs(qTopics)

        const topicsToRemove = querySnapshotTopics.docs.map(item => item.id)

        //Get subtopics to remove
        const qSubtopics = await query(subtopicRef,
            where('topicId', '==', topicsToRemove)
        )

        const querySnapshotSubtopics = await getDocs(qSubtopics)

        const subtopicsToRemove = querySnapshotSubtopics.docs.map(item => item.id)

        //Get content to remove
        const qContent = await query(contentRef,
            where('subtopicId', '==', subtopicsToRemove)
        )

        const querySnapshotContent = await getDocs(qContent)

        const contentToRemove = querySnapshotContent.docs.map(item => item.id)

        //Remove content

        for (const content of contentToRemove) {

            await deleteDoc(doc(contentRef, content))

        }

        //Remove subtopics

        for (const subtopic of subtopicsToRemove) {

            await deleteDoc(doc(subtopicRef, subtopic))

        }

        //Remove topics

        for (const topic of topicsToRemove) {

            await deleteDoc(doc(topicRef, topic))

        }

        //Remove unit

        await deleteDoc(doc(unitRef, unitId))

        return 'Data removed successfully'

    } catch (error) {

        throw new Error(`${error}`)

    }

}


const removeTopics = async (removedThings: RemovedThings) => {

    try {

        if (removedThings.topics.length === 0) return 'Data removed successfully'

        const topicsRef = await collection(db, 'topics')
        const subtopicRef = await collection(db, 'subtopics')
        const contentRef = await collection(db, 'content')

        //Get subtopics to remove
        const qSubtopics = await query(subtopicRef,
            where('topicId', '==', removedThings.topics)
        )

        const querySnapshotSubtopics = await getDocs(qSubtopics)

        const subtopicsToRemove = querySnapshotSubtopics.docs.map(item => item.id)

        //Get content to remove
        const qContent = await query(contentRef,
            where('subtopicId', '==', subtopicsToRemove)
        )

        const querySnapshotContent = await getDocs(qContent)

        const contentToRemove = querySnapshotContent.docs.map(item => item.id)

        //Remove content

        for (const content of contentToRemove) {

            await deleteDoc(doc(contentRef, content))

        }

        //Remove subtopics

        for (const subtopic of subtopicsToRemove) {

            await deleteDoc(doc(subtopicRef, subtopic))

        }

        //Remove topics

        for (const topic of removedThings.topics) {

            await deleteDoc(doc(topicsRef, topic))

        }


        return 'Data removed successfully'

    } catch (error) {

        throw new Error(`${error}`)

    }

}

const removeSubtopics = async (removedThings: RemovedThings) => {

    try {

        if (removedThings.subtopics.length === 0) return 'Data removed successfully'

        const subtopicsRef = await collection(db, 'subtopics')
        const contentRef = await collection(db, 'content')

        //Get content to remove
        const qContent = await query(contentRef,
            where('subtopicId', '==', removedThings.subtopics)
        )

        const querySnapshotContent = await getDocs(qContent)

        const contentToRemove = querySnapshotContent.docs.map(item => item.id)

        //Remove content

        for (const content of contentToRemove) {

            await deleteDoc(doc(contentRef, content))

        }

        //Remove subtopics

        for (const subtopic of removedThings.subtopics) {

            await deleteDoc(doc(subtopicsRef, subtopic))

        }

        return 'Data removed successfully'

    } catch (error) {

        throw new Error(`${error}`)

    }
}

const removeContent = async (removedThings: RemovedThings) => {

    try {

        if (removedThings.content.length === 0) return 'Data removed successfully'

        const contentRef = await collection(db, 'content')

        for (const content of removedThings.content) {

            await deleteDoc(doc(contentRef, content))

        }

        return 'Data removed successfully'

    } catch (error) {

        throw new Error(`${error}`)

    }
}

const addNewTopic = async (unit: Unit, topic: Topic) => {

    try {

        const topicRef = collection(db, 'topics')

        //Query to get the last topic number by relativeId

        const q = query(
            topicRef,
            orderBy(
                'relativeId',
                'desc'
            ),
            limit(1)
        )

        const relativeIdTopic = await getDocs(q)

        addDoc(topicRef, {
            description: topic.description,
            sources: topic.sources,
            topicNumber: topic.topicNumber,
            topicTitle: topic.topicTitle,
            unitId: unit.id,
            relativeId: relativeIdTopic.docs[0].data().relativeId + 1
        }).then(async (docRef) => {

            if (topic.subtopics.length === 0) return 'Data added successfully'

            //Ref to subtopics collection
            const subtopicsRef = await collection(db, 'subtopics')


            //Add subtopics to subtopics collection
            for (const subtopic of topic.subtopics) {

                //Query to get the last subtopic number by relativeId

                const q = query(
                    subtopicsRef,
                    orderBy(
                        'relativeId',
                        'desc'
                    ),
                    limit(1)
                )

                const relativeIdSubtopic = await getDocs(q)

                await addDoc(subtopicsRef, {
                    description: subtopic.description,
                    sources: subtopic.sources,
                    subtopicNumber: subtopic.subtopicNumber,
                    subtopicTitle: subtopic.subtopicTitle,
                    topicId: docRef.id,
                    relativeId: relativeIdSubtopic.docs[0].data().relativeId + 1
                }).then(async (docRef) => {

                    if (subtopic.content.length === 0) return 'Data added successfully'
                    //Ref to content collection
                    const contentRef = await collection(db, 'content')


                    //Add content to content collection
                    for (const content of subtopic.content) {

                        //Query to get the last content number by relativeId

                        const q = query(
                            contentRef,
                            orderBy(
                                'relativeId',
                                'desc'
                            ),
                            limit(1)
                        )

                        const relativeIdContent = await getDocs(q)

                        await addDoc(contentRef, {
                            contentNumber: content.contentNumber,
                            contentTitle: content.contentTitle,
                            description: content.description,
                            image: content.image,
                            subtopicId: docRef.id,
                            type: content.type,
                            url: content.url,
                            relativeId: relativeIdContent.docs[0].data().relativeId + 1
                        })

                    }

                })

            }

        })

    } catch (error) {

    }


}

const addNewSubtopic = async (topic: Topic, subtopic: Subtopic) => {

    try {

        const subtopicRef = collection(db, 'subtopics')

        //Query to get the last subtopic number by relativeId

        const q = query(
            subtopicRef,
            orderBy(
                'relativeId',
                'desc'
            ),
            limit(1)
        )

        const relativeIdSubtopic = await getDocs(q)

        addDoc(subtopicRef, {
            description: subtopic.description,
            sources: subtopic.sources,
            subtopicNumber: subtopic.subtopicNumber,
            subtopicTitle: subtopic.subtopicTitle,
            topicId: topic.id,
            relativeId: relativeIdSubtopic.docs[0].data().relativeId + 1
        }).then(async (docRef) => {

            if (subtopic.content.length === 0) return 'Data added successfully'
            //Ref to content collection
            const contentRef = await collection(db, 'content')

            for (const content of subtopic.content) {

                //Query to get the last content number by relativeId

                const q = query(
                    contentRef,
                    orderBy(
                        'relativeId',
                        'desc'
                    ),
                    limit(1)
                )

                const relativeIdContent = await getDocs(q)

                await addDoc(contentRef, {
                    contentNumber: content.contentNumber,
                    contentTitle: content.contentTitle,
                    description: content.description,
                    image: content.image,
                    subtopicId: docRef.id,
                    type: content.type,
                    url: content.url,
                    relativeId: relativeIdContent.docs[0].data().relativeId + 1
                })

            }

        })



    } catch (error) {

    }

}


const addNewContent = async (subtopic: Subtopic, content: Content) => {

    try {

        const contentRef = collection(db, 'content')

        //Query to get the last content number by relativeId

        const q = query(
            contentRef,
            orderBy(
                'relativeId',
                'desc'
            ),
            limit(1)
        )

        const relativeIdContent = await getDocs(q)


        addDoc(contentRef, {
            contentNumber: content.contentNumber,
            contentTitle: content.contentTitle,
            description: content.description,
            image: content.image,
            subtopicId: subtopic.id,
            type: content.type,
            url: content.url,
            relativeId: relativeIdContent.docs[0].data().relativeId + 1
        })

    } catch (error) {

    }

}

/**
 * Update unit function
*/
export const updateUnit = async (uid: string, subjectId: string, unit: Unit, removedThings: RemovedThings) => {

    try {

        // console.log(JSON.stringify(unit))

        //Get unit ref
        const unitsRef = await collection(db, 'units')

        let data: string;

        //Update unit
        await setDoc(doc(unitsRef, unit.id), {
            description: unit.description,
            sources: unit.sources,
            subjectId: subjectId,
            teacherUid: uid,
            unitNumber: unit.unitNumber,
            unitTitle: unit.unitTitle,
            relativeId: unit.relativeId
        })

        //Check for topics
        if (!unit.topics || unit.topics.length === 0) {
            data = 'Salio en topics'
        } else {

            //For each topic
            for (const topic of unit.topics) {

                if (topic.id === '') {
                    //Add new topic
                    await addNewTopic(unit, topic)
                } else {

                    //Get topic ref
                    const topicsRef = await collection(db, 'topics')

                    //Update topic
                    await setDoc(doc(topicsRef, topic.id), {

                        description: topic.description,
                        sources: topic.sources,
                        topicNumber: topic.topicNumber,
                        topicTitle: topic.topicTitle,
                        unitId: unit.id,
                        relativeId: topic.relativeId

                    })

                    //Check for subtopics
                    if (topic.subtopics.length === 0) {
                        data = 'Salio en subtopics'
                    } else {

                        //For each subtopic
                        for (const subtopic of topic.subtopics) {

                            if (subtopic.id === '') {
                                //Add new subtopic
                                await addNewSubtopic(topic, subtopic)
                            } else {

                                //Get subtopic ref
                                const subtopicsRef = await collection(db, 'subtopics')

                                //Update subtopic
                                await setDoc(doc(subtopicsRef, subtopic.id), {

                                    description: subtopic.description,
                                    sources: subtopic.sources,
                                    subtopicNumber: subtopic.subtopicNumber,
                                    subtopicTitle: subtopic.subtopicTitle,
                                    topicId: topic.id,
                                    relativeId: subtopic.relativeId

                                })

                                //Check for content
                                if (subtopic.content.length === 0) {
                                    data = 'Salio en content'
                                } else {

                                    //For each content
                                    for (const content of subtopic.content) {

                                        if (content.id === '') {
                                            //Add new content
                                            await addNewContent(subtopic, content)
                                        } else {

                                            //Get content ref
                                            const contentRef = await collection(db, 'content')

                                            //Update content
                                            await setDoc(doc(contentRef, content.id), {

                                                contentNumber: content.contentNumber,
                                                contentTitle: content.contentTitle,
                                                description: content.description,
                                                image: content.image,
                                                subtopicId: subtopic.id,
                                                type: content.type,
                                                url: content.url,
                                                relativeId: content.relativeId

                                            })

                                        }
                                    }

                                }

                            }
                        }

                    }

                }
            }

        }

        //Remove topics
        await removeTopics(removedThings)

        //Remove subtopics
        await removeSubtopics(removedThings)

        //Remove content
        await removeContent(removedThings)


    } catch (error) {

        return {
            id: -1,
            message: `${error}`
        }

    }

}