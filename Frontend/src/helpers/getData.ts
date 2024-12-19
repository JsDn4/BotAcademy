import axios from "axios"


export const getData = async (unitId: string) => {

    try {

        const dataPost = {
            unitId: unitId
        }

        const resp = await axios.post("http://127.0.0.1:8000/data", dataPost)

        const { data } = resp

        return data

    } catch (error) {

    }

}