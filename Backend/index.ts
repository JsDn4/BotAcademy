import dotenv from "dotenv";
dotenv.config()

import express, { Express } from "express";
import bodyParser from "body-parser";

import cors from "cors";

import {
    //Get Functions
    getUnits,
    getSubjects,
    getTeacherInfo,
    getTopics,
    getSubtopics,
    getContent,

    //Create Functions
    createCompleteUnit,
    updateUnit,
    getUnitById,
    removeUnit,
} from './DB/queries';

import { onLogin, onSignOut } from './DB/authFunctions';

import {
    RemovedThings,
    Unit,
    contentInfo,
    errorType,
    loginInfo,
    subjectType,
    subjectTypeArray,
    subtopicsInfo,
    teacherInfo,
    topicsInfo,
    unitsInfo
} from './DB/types';


const port = process.env.PORT
const app: Express = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.disable("x-powered-by")

/**
 * Login
 */
app.post('/login', async (req, res) => {
    try {

        const userCredentials: loginInfo | errorType = await onLogin(req.body.username, req.body.pass)

        if ('uid' in userCredentials) {

            const subjects: subjectTypeArray = []
            const teacherInfo: teacherInfo = await getTeacherInfo(userCredentials.uid)

            for (const item of teacherInfo.subjects) {

                const subject: subjectType = await getSubjects(item)

                subjects.push(
                    subject
                )
            }

            res.send({
                teacherInfo: teacherInfo,
                subjects: subjects
            })
        } else {
            res.send({
                error: userCredentials
            })
        }


    } catch (error) {

        res.send('Ha habido un error en el servidor')

    }
})


app.post('/signOut', async (req, res) => {
    try {

        await onSignOut(req.body.uid)

        res.send()

    } catch (error) {

    }
})


app.post('/getUnits', async (req, res) => {
    try {

        const uid: string = req.body.uid
        const subjectId: string = req.body.subjectId

        const units: unitsInfo | errorType = await getUnits(uid, subjectId)

        res.send(units)
        return

    } catch (error) {

        res.send('Oops something was wrong in server.')

    }

})




//is the same function, but the data returned is different, only return units, without topics, subtopics and content

app.post("/data", async (req, res) => {

    try {

        const unitId = req.body.unitId

        let topics: topicsInfo = []
        let error: errorType

        const unit: Unit | errorType = await getUnitById(unitId)

        const topicsDataByUnit: topicsInfo | errorType = await getTopics(unitId)

        if ('message' in topicsDataByUnit) {
            error = topicsDataByUnit

            res.send(error)
            return
        } else {
            topics.push(...topicsDataByUnit)
        }


        let subtopics: subtopicsInfo = []

        for (const item of topics) {

            const subtopicsDataByTopic: subtopicsInfo | errorType = await getSubtopics(item.id)
            if ('message' in subtopicsDataByTopic) {
                error = subtopicsDataByTopic

                res.send(error)
                return
            } else {
                subtopics.push(...subtopicsDataByTopic)
            }


        }

        let content: contentInfo = []

        for (const item of subtopics) {

            const contentDataByTopic: contentInfo | errorType = await getContent(item.id)
            if ('message' in contentDataByTopic) {
                error = contentDataByTopic

                res.send(error)
                return
            } else {
                content.push(...contentDataByTopic)
            }

        }

        const data = topicsDataByUnit.map(topic => {
            const topicSubtopics = subtopics.filter(subtopic => subtopic.topicId === topic.id);

            const organizedSubtopics = topicSubtopics.map(subtopic => {
                const subtopicContent = content.filter(content => content.subtopicId === subtopic.id);

                return {
                    ...subtopic,
                    content: subtopicContent
                };
            });

            return {
                ...topic,
                subtopics: organizedSubtopics
            };

        });

        if ('message' in unit) {

            res.send(unit)
            return
        }
        else {
            res.send({
                ...unit,
                topics: data
            })
        }
    } catch (error) {

        res.send('Ha habido un error en el servidor')

    }

})

app.post('/createUnit', async (req, res) => {
    try {

        const uid: string = req.body.uid
        const subjectId: string = req.body.subjectId
        const unit: Unit = req.body.unit

        const dataAdded: string | errorType = await createCompleteUnit(uid, subjectId, unit)

        if (typeof dataAdded === 'string') {

            res.send('ok')
        } else {
            res.send(dataAdded)
        }

    } catch (error) {

        res.send('Ha habido un error en el servidor')

    }

})

app.post('/updateUnit', async (req, res) => {
    try {

        const uid: string = req.body.uid
        const subjectId: string = req.body.subjectId
        const unit: Unit = req.body.unit
        const removedThings: RemovedThings = req.body.removedThings

        const resp = await updateUnit(uid, subjectId, unit, removedThings)

        res.send({
            resp: resp
        }).status(200)

    } catch (error) {

        res.send('Ha habido un error en el servidor').status(500)

    }

})


app.post('/removeUnit', async (req, res) => {
    try {

        const unitId: string = req.body.unitId

        const resp = await removeUnit(unitId)

        res.send({
            resp: resp
        }).status(200)

    } catch (error) {

        res.send('Ha habido un error en el servidor').status(500)

    }

})

// app.post('/removeContent', async (req, res) => {
//     try {

//         const removedThings = req.body.removedThings

//         const resp = await removeContent(removedThings)

//         res.send({
//             resp: resp
//         }).status(200)

//     } catch (error) {

//         res.send('Ha habido un error en el servidor').status(500)

//     }

// })


app.listen(port, () => {
    console.log(`Servidor conectado y listo en el puerto ${port}`)
})