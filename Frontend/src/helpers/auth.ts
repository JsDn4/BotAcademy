import axios from "axios"

export const requestAuth = async (username: string, pass: string) => {

    try {

        const dataPost = {

            username,
            pass

        }

        const resp = await axios.post("http://127.0.0.1:8000/login", dataPost)
        const { data } = resp

        return data

    } catch (err) {

        return {
            error: 'Hubo un error en la peticion'
        }

    }
}
