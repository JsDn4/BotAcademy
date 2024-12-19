import { useEffect, useState } from "react";
import { RemovedThings, Unit, userCredentials } from "../types";
import { getData } from "../helpers/getData";
import { useNavigate } from "react-router-dom";

export const useGetData = (unitId: string) => {

    const navigate = useNavigate()

    const [unit, setUnit] = useState<Unit>({
        id: '',
        description: '',
        unitNumber: 0,
        sources: [],
        unitTitle: '',
        topics: [],
        subjectId: '',
        teacherUid: '',
        relativeId: 0,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true)

    //The behavior is like a onChange of the unit 
    const [removedThings, setRemovedThings] = useState<RemovedThings>({
        topics: [],
        subtopics: [],
        content: [],
    })

    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    //Check if there is a unit in sessionStorage
    useEffect(() => {

        if (!unitId) {
            navigate('/Home')
        }

        const fetch = async () => {

            const data = await getData(unitId)

            return data

        }

        fetch().then((data) => {
            if (data !== null) {
                setIsUpdate(true)
                setUnit(data)
                setRemovedThings({
                    topics: [],
                    subtopics: [],
                    content: [],
                })
            } else {

                const storagedData: string | null = sessionStorage.getItem('data')
                const data: userCredentials = storagedData !== null ? JSON.parse(storagedData) : null
                const uid = data.teacherInfo.uid

                setUnit({
                    ...unit,
                    subjectId: unitId,
                    teacherUid: uid
                })
            }
            setIsLoading(false)
        })

    }, [unitId])

    return {
        unit,
        removedThings,
        isUpdate,
        isLoading,
        setUnit,
    }
}