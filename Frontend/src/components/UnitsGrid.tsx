import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUnits } from "../helpers/getUnits"
import { removeUnit } from "../helpers/removeUnit"
import { DataSubject, userCredentials } from "../types"

/**
 * @prop {id} : subject id 
 */

export const UnitsGrid: React.FC<{ id: string }> = ({ id }) => {

    const navigate = useNavigate()

    const [data, setData] = useState<DataSubject>()


    const getData = () => {

        const storedData: string | null = sessionStorage.getItem('data')
        const data: userCredentials = storedData !== null ? JSON.parse(storedData) : null

        return data

    }

    //Clear unit data from sessionStorage
    sessionStorage.removeItem('unit')

    const dataProcesed = getData()

    const uid = dataProcesed.teacherInfo.uid


    useEffect(() => {

        if (!id) {
            navigate('/Home')
        }


        const fetch = async () => {

            try {

                const fetchData = await getUnits(uid, id)

                setData(fetchData)

            } catch (error) {

            }


        }

        fetch()

    }, [])

    return (
        <>

            {data?.map(item => (
                <div key={item.id} className="mx-auto w-96 bg-gray-100 p-4 mb-4 rounded shadow-md flex items-center">
                    <p className="text-lg font-bold flex-grow">{item.unitTitle}</p>
                    <Link
                        to={`/Update`}
                        state={item.id}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={() => sessionStorage.setItem('unit', JSON.stringify(item))}
                    //TODO check data that is sent to Update component
                    //I need send only id and the other component will be able process the petition
                    >
                        Actualizar
                    </Link>

                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        onClick={() => {
                            removeUnit(item.id)
                        }}
                    >
                        Eliminar
                    </button>
                </div >
            ))}



        </>
    )
}
