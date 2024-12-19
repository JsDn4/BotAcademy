import axios from "axios"


export const getUnits = async (uid: string, subjectId: string) => {

    try {

        const dataPost = {
            uid: uid,
            subjectId: subjectId
        }

        const resp = await axios.post("http://127.0.0.1:8000/getUnits", dataPost)

        const { data } = resp

        return data

    } catch (error) {

    }

}