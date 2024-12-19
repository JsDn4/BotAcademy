import axios from 'axios';
import { Unit } from '../types';
export const CreateUnit = async (unit: Unit, uid: string, subjectId: string) => {

    try {

        const dataPost = {
            unit,
            uid,
            subjectId
        }

        const resp = await axios.post("http://127.0.0.1:8000/createUnit", dataPost)

        return resp.status

    } catch (err) {

        return {
            error: 'Hubo un error en la peticion'
        }

    }


}