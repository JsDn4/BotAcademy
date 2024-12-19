import { UserDataLoged } from "../types"
import { Link } from "react-router-dom"

export const SubjectsGrid: React.FC = () => {

    const getData = () => {

        const storedData: string | null = sessionStorage.getItem('data')
        const data: UserDataLoged = storedData !== null ? JSON.parse(storedData) : null

        return data

    }

    const dataProcesed = getData()

    return (
        <div className="flex flex-wrap justify-center">

            {dataProcesed.subjects.map(item => (

                <Link
                    to={`/Units`}
                    state={item.id}
                    key={item.id}
                    className="m-2 p-4 border border-gray-300 w-1/3 min-h-50"

                >
                    <div>
                        <p className="font-bold text-center">{item.subject}</p>
                    </div>
                </Link>


            ))
            }

        </div >
    )
}
