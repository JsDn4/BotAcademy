import { useLocation } from "react-router-dom"
import * as component from "../components"
import { UserDataLoged } from "../types"

export const UnitsView: React.FC = () => {

    const location = useLocation()

    const id = location.state

    const getData = () => {

        const storedData: string | null = sessionStorage.getItem('data')
        const data: UserDataLoged = storedData !== null ? JSON.parse(storedData) : null

        return data

    }

    const prosecedData = getData()

    const subject: string | undefined = prosecedData.subjects.find(item => item.id === id)?.subject

    return (
        <>
            <component.Header flag={true} id={id} />
            <h3 className="text-2xl font-bold text-blue-500 text-center">{subject}</h3>

            <main>
                <component.UnitsGrid id={id} />
            </main>
        </>
    )
}
