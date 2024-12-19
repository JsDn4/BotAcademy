import axios from "axios";

export const removeUnit = async (unitId: string) => {

    try {

        const dataPost = {
            unitId: unitId
        }

        const resp = await axios.post("http://localhost:8000/removeUnit", dataPost)

        return resp.status

    } catch (error) {

        return {
            err: -1,
            msg: error
        }

    }

}