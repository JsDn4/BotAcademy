/* eslint-disable linebreak-style */
const firestore = require('firebase/firestore');

const db = require('./connection');

const app = firestore.getFirestore(db);

const getSubjects = async () => {
  try {
    const subjectsRef = firestore.collection(app, 'subjects');

    const subjectsSnapshot = await firestore.getDocs(subjectsRef);

    const subjectsList = subjectsSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        subject: doc.data().subject,
      };
    });

    return subjectsList;
  } catch (error) {
    console.log(error);
  }
};

async function getTeachers(subjectId) {
  try {
    const teachersRef = firestore.collection(app, 'teachers');

    const q = firestore.query(teachersRef, firestore.where('subjects', 'array-contains', subjectId));

    const teachersSnapshot = await firestore.getDocs(q);

    const teachersList = teachersSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().teacherName,
      };
    });

    return teachersList;
  } catch (error) {
    console.log(error);
  }
}

async function getUnitsByTeacherNameAndSubject(subjectId, teacherId) {

  try {
    const unitsRef = firestore.collection(app, 'units');

    const teacherRef = firestore.collection(app, 'teachers');
    const teacherSnapshot = await firestore.doc(teacherRef, teacherId);
    const teacher = await firestore.getDoc(teacherSnapshot);
    const teacherUid = teacher.data().uid;

    const q = firestore.query(
      unitsRef,
      firestore.where('subjectId', '==', subjectId),
      firestore.where('teacherUid', '==', teacherUid),
      firestore.orderBy('unitNumber', 'asc'),
    );

    const unitsSnapshot = await firestore.getDocs(q);

    const unitsList = unitsSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        description: doc.data().description,
        sources: doc.data().sources,
        unitTitle: doc.data().unitTitle,
        unitNumber: doc.data().unitNumber,
        relativeId: doc.data().relativeId,
      }
    });

    return unitsList;


  } catch (error) {
    console.log(error);
  }

}

async function getTopics(subjectId, teacherId, unitNumber) {
  try {

    const teacherRef = await firestore.collection(app, 'teachers');
    const teacherSnapshot = await firestore.doc(teacherRef, teacherId);
    const teacher = await firestore.getDoc(teacherSnapshot);
    const teacherUid = await teacher.data().uid;

    const unitsRef = await firestore.collection(app, 'units');
    const unitsq = await firestore.query(
      unitsRef,
      firestore.where('subjectId', '==', subjectId),
      firestore.where('teacherUid', '==', teacherUid),
      firestore.where('unitNumber', '==', `${unitNumber}`),
    );

    const unitsSnapshot = await firestore.getDocs(unitsq);

    const unitsList = await unitsSnapshot.docs.map((doc) => {

      return {
        id: doc.id,
        description: doc.data().description,
        sources: doc.data().sources,
        unitTitle: doc.data().unitTitle,
        unitNumber: doc.data().unitNumber,
        relativeId: doc.data().relativeId,
      }
    });

    const topicsRef = await firestore.collection(app, 'topics');
    const topicsq = await firestore.query(
      topicsRef,
      firestore.where('unitId', '==', unitsList[0].id),
      firestore.orderBy('topicNumber', 'asc'),
    );
    const topicsSnapshot = await firestore.getDocs(topicsq);

    const topicsList = await topicsSnapshot.docs.map((doc) => {

      return {
        id: doc.id,
        description: doc.data().description,
        topicTitle: doc.data().topicTitle,
        topicNumber: doc.data().topicNumber,
        relativeId: doc.data().relativeId,
        sources: doc.data().sources,
      }
    })

    return {
      unit: unitsList[0],
      topics: topicsList,
    }
  } catch (error) {
    console.log(error);
  }
}

async function getSubtopics(topicId) {

  try {

    const subtopicsRef = firestore.collection(app, 'subtopics');
    const subtopicsq = firestore.query(
      subtopicsRef,
      firestore.where('topicId', '==', topicId),
      firestore.orderBy('subtopicNumber', 'asc'),
    );

    const subtopicsSnapshot = await firestore.getDocs(subtopicsq);

    const subtopicsList = subtopicsSnapshot.docs.map((doc) => {

      return {
        id: doc.id,
        description: doc.data().description,
        subtopicTitle: doc.data().subtopicTitle,
        subtopicNumber: doc.data().subtopicNumber,
        relativeId: doc.data().relativeId,
        sources: doc.data().sources,
      }
    })

    return subtopicsList;

  } catch (error) {
    console.log(error);
  }

}

async function getContent(subtopicId) {

  try {

    const contentRef = await firestore.collection(app, 'content');
    const contentq = await firestore.query(
      contentRef,
      firestore.where('subtopicId', '==', subtopicId),
    );

    const contentSnapshot = await firestore.getDocs(contentq);

    const contentList = contentSnapshot.docs.map((doc) => {

      return {
        id: doc.id,
        description: doc.data().description,
        contentTitle: doc.data().contentTitle,
        image: doc.data().image,
        type: doc.data().type,
        url: doc.data().url,
      }
    })


    return contentList;

  } catch (error) {
    console.log(error);
  }

}

module.exports = {
  getSubjects,
  getTeachers,
  getUnitsByTeacherNameAndSubject,
  getTopics,
  getSubtopics,
  getContent,
};
