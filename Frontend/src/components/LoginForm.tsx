import { lazy, useState, useEffect } from "react"
import { FormDataType, OnLoginFunction, error, userCredentials } from '../types'
import { requestAuth } from "../helpers/auth"



export const LoginForm: React.FC<OnLoginFunction> = ({ onLogin }) => {

    const [formData, setFormData] = useState<FormDataType>({
        username: '',
        pass: ''
    })


    const [, setData] = useState<userCredentials | error>()

    const [submit, setSubmit] = useState<number>(0)

    const [err, setErr] = useState(false)

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target

        setFormData((prevData: FormDataType) => ({
            ...prevData,
            [name]: value
        }))

    }

    const onHandleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        setSubmit((currentSubmit) => currentSubmit + 1)

    }

    const handleLogin = async () => {

        if (submit > 0) {
            const fetchData: error | userCredentials = await requestAuth(formData.username, formData.pass)

            if ('error' in fetchData) {

                setFormData((prevData: FormDataType) => ({

                    ...prevData,
                    username: '',
                    pass: ''

                }))

                setErr(true)

            } else {

                setData(fetchData)

                sessionStorage.setItem('data', JSON.stringify(fetchData))

                onLogin()

            }
        }

    }

    useEffect(() => {

        handleLogin()

    }, [submit])


    return (
        <>

            <div className="w-full max-w-xl p-8 border rounded-lg shadow-lg bg-white">
                <div className="flex items-center justify-center">
                    <img onLoad={() => lazy} src="/favicon.ico" alt="Bot academy icon" />

                    <h1 className="text-4xl font-bold text-primary">
                        Bot Academy
                        </h1>


                </div>


                {err &&
                    <div>
                        <p className="text-red-600">
                            Usuario o contraseña incorrectos, por favor intentelo nuevamente
                        </p>
                    </div>}

                <form onSubmit={onHandleSubmit} className="mt-4">

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Correo electronico"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={onInputChange}
                            required

                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            id="pass"
                            name="pass"
                            value={formData.pass}
                            onChange={onInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Login
                        </button>

                    </div>


                </form>
            </div>

        </>
    )

}