const dotenv = require("dotenv");
dotenv.config()

const functions = require('firebase-functions');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const responses = require('./helpers/res/responses');
const { getSubjects, getTeachers, getUnitsByTeacherNameAndSubject, getTopics, getSubtopics, getContent } = require('./helpers/db/queries');


/**
 * @security this function does not allow access if the user try to
 *  access by browser
 */
app.get('/', (req, res) => {
    res.send('uppss... you are not allowed to access this page');
});
app.get('/botAcademy', (req, res) => {
    res.send('uppss... you are not allowed to access this page');
});

// Access by post
app.post('/botAcademy', (req, res) => {

    const sendData = async () => {
        try {
            const context = req.body.queryResult.intent.displayName;
            let result = '';
            let queryResult = '';
            let text = '';

            let subjectId = '';
            let teacherId = '';
            let unitNumber = '';
            let topicNumber = '';

            let subjectsData = [];
            let teachersData = [];
            let unitsData = [];
            let topicsData = [];
            let subtopicsData = [];
            let contentData = [];

            let topic = {};


            switch (context) {
                case 'Default Welcome Intent':

                    result = await responses.basicResponse(
                        'Hola, ¿En que puedo ayudarte el dia de hoy?',
                    );

                    await responses.telegramResponse(
                        result,
                        'Hola, ¿En que puedo ayudarte el dia de hoy? \n /materias',
                    );


                    break;

                case 'GetSubjects':

                    subjectsData = await getSubjects();

                    subjectsData = subjectsData.map((subject) => {
                        return subject.subject
                    });


                    result = await responses.basicResponse(
                        'Estas son las materias que hay disponibles',
                    );

                    responses.telegramQuickReplies(result, 'Materias', subjectsData);
                    break;

                case 'GetTeachersNamesBySubject':

                    queryResult = req.body.queryResult.queryText;

                    subjectsData = await getSubjects();

                    subjectId = subjectsData.find((subject) => {
                        return subject.subject === queryResult;
                    });

                    teachersData = await getTeachers(subjectId.id);

                    teachersData = teachersData.map((teacher) => {
                        return teacher.name;
                    });

                    result = await responses.basicResponse(
                        'Estos son los profesores que hay disponibles',
                    );

                    responses.telegramQuickReplies(result, `Profesores de ${queryResult}`, teachersData);


                    break;

                case 'GetUnitsByTeacherNameAndSubject':

                    subjectId = req.body.queryResult.outputContexts[1].parameters['subject.original'];
                    teacherId = req.body.queryResult.outputContexts[1].parameters['teacherId'];

                    subjectsData = await getSubjects();

                    subjectId = subjectsData.find((subject) => {
                        return subject.subject === subjectId;
                    });

                    unitsData = await getUnitsByTeacherNameAndSubject(subjectId.id, teacherId);

                    result = await responses.basicResponse(
                        'Te presento las unidades disponibles',
                    );

                    unitsData = unitsData.map((unit) => {
                        text += `/Unidad${unit.unitNumber} - ${unit.unitTitle} \n`
                    });

                    responses.telegramResponse(result, `Unidades de ${subjectId.subject}`);
                    responses.telegramResponse(result, text);

                    break;

                case 'GetTopics':

                    subjectId = req.body.queryResult.outputContexts[3].parameters['subject.original'];
                    teacherId = req.body.queryResult.outputContexts[3].parameters['teacherId'];
                    unitNumber = req.body.queryResult.outputContexts[3].parameters['unit'];

                    subjectsData = await getSubjects();

                    subjectId = subjectsData.find((subject) => {
                        return subject.subject === subjectId;
                    });


                    topicsData = await getTopics(subjectId.id, teacherId, unitNumber);

                    result = await responses.basicResponse(
                        topicsData.unit.description,
                    );

                    await responses.telegramResponse(
                        result,
                        topicsData.unit.description,
                    );

                    if (topicsData.unit.sources.length > 0) {

                        await responses.telegramResponse(
                            result,
                            'Antes de presentarte los temas disponibles tu profesor te recomienda que eches un vistazo a estos recursos'
                        );

                        responses.telegramResponse(result, 'Recursos');

                        topicsData.unit.sources.forEach((source) => {
                            responses.telegramResponse(result, `${source.source}`);
                        });

                    }

                    topicsData.topics.map((topic) => {
                        text += `/Tema${topic.topicNumber} - ${topic.topicTitle} \n`
                    });

                    responses.telegramResponse(result, `Temas de ${subjectId.subject}`);
                    responses.telegramResponse(result, text);

                    break;

                case 'GetSubtopics':

                    try {
                        subjectId = req.body.queryResult.outputContexts[4].parameters['subject.original'];
                        teacherId = req.body.queryResult.outputContexts[4].parameters['teacherId'];
                        unitNumber = req.body.queryResult.outputContexts[4].parameters['unit'];
                        topicNumber = req.body.queryResult.outputContexts[4].parameters['topic'];

                        // console.log(subjectId, teacherId, unitNumber, topicNumber);

                        subjectsData = await getSubjects();

                        subjectId = subjectsData.find((subject) => {
                            return subject.subject === subjectId;
                        });

                        topicsData = await getTopics(subjectId.id, teacherId, unitNumber);

                        topic = topicsData.topics.find((topic) => {
                            return topic.topicNumber === `${topicNumber}`;
                        });

                        result = await responses.basicResponse(
                            topic.description,
                        );

                        await responses.telegramResponse(
                            result,
                            topic.description,
                        );

                        if (topic.sources.length > 0) {

                            await responses.telegramResponse(
                                result,
                                'Antes de presentarte los subtemas disponibles tu profesor te recomienda que eches un vistazo a estos recursos'
                            );

                            await responses.telegramResponse(result, 'Recursos');

                            topic.sources.forEach((source) => {

                                responses.telegramResponse(result, `${source.source}`);

                            });

                        }

                        subtopicsData = await getSubtopics(topic.id);

                        subtopicsData = subtopicsData.map((subtopic) => {
                            text += `/Subtema${subtopic.subtopicNumber} - ${subtopic.subtopicTitle} \n`
                        });

                        responses.telegramResponse(result, `Subtemas de ${topic.topicTitle}`);
                        responses.telegramResponse(result, text);

                    } catch (error) {
                        console.log(error);
                    }
                    break;

                case 'GetContent':

                    subjectId = req.body.queryResult.outputContexts[4].parameters['subject.original'];
                    teacherId = req.body.queryResult.outputContexts[4].parameters['teacherId'];
                    unitNumber = req.body.queryResult.outputContexts[4].parameters['unit'];
                    topicNumber = req.body.queryResult.outputContexts[4].parameters['topic'];
                    subtopicNumber = req.body.queryResult.outputContexts[4].parameters['subtopic'];

                    // console.log(subjectId, teacherId, unitNumber, topicNumber, subtopicNumber);

                    subjectsData = await getSubjects();
                    subjectId = subjectsData.find((subject) => {
                        return subject.subject === subjectId;
                    });

                    topicsData = await getTopics(subjectId.id, teacherId, unitNumber);
                    topic = topicsData.topics.find((topic) => {
                        return topic.topicNumber === `${topicNumber}`;
                    });

                    console.log(topic);

                    subtopicsData = await getSubtopics(topic.id);
                    subtopic = subtopicsData.find((subtopic) => {
                        return subtopic.subtopicNumber === `${subtopicNumber}`;
                    });

                    result = await responses.basicResponse(
                        subtopic.description,
                    );
                    await responses.telegramResponse(
                        result,
                        subtopic.description,
                    );

                    if (subtopic.sources.length > 0) {

                        await responses.telegramResponse(
                            result,
                            'Antes de presentarte los contenidos disponibles tu profesor te recomienda que eches un vistazo a estos recursos'
                        );

                        await responses.telegramResponse(result, 'Recursos');

                        subtopic.sources.forEach((source) => {

                            if (source.type == 0) {
                                responses.telegramResponse(result, `${source.source} - Web`);
                            } else if (source.type == 1) {
                                responses.telegramResponse(result, `${source.source} - Doc`);
                            } else if (source.type == 2) {
                                responses.telegramResponse(result, `${source.source} - Video`);
                            }

                        });

                    }

                    contentData = await getContent(subtopic.id);

                    contentData = contentData.map((content) => {
                        responses.telegramCard(result, content.title, content.description, content.image, content.url);
                    })


                    break;

                case 'Default Fallback Intent':
                    result = await responses.basicResponse(
                        'Lo siento, no te he entendido, por favor intenta nuevamente',
                    );

                    await responses.telegramResponse(
                        result,
                        'Lo siento, no te he entendido, por favor intenta nuevamente o escribe /start para volver al inicio',
                    );
                    break;
                default:
                    break;
            }

            res.json(result);
        } catch (error) {
            res.json(error);
        }
    };

    sendData();
});

// Server Start
// Change this to false if you want to deploy to firebase
const local = false;
const port = 3000;

if (local) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
} else {
    exports.app = functions.https.onRequest(app);
}