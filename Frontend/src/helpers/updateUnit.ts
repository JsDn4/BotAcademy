import axios from "axios";
import { RemovedThings, Unit } from "../types";


export const updateUnit = async (unit: Unit, uid: string, subjectId: string, removedThings: RemovedThings) => {

    try {

        const dataPost = {
            unit,
            uid,
            subjectId,
            removedThings
        }

        console.log(dataPost)

        const resp = await axios.post("http://127.0.0.1:8000/updateUnit", dataPost)

        return resp.status

    } catch (error) {

        return {
            err: -1,
            msg: error
        }

    }

}