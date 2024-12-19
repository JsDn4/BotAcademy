import React, { useEffect, useState } from "react"
import { RemovedThings, Source, Unit, userCredentials } from '../types';
import { SourceField } from "./SourcesFieldComp"
import { Topics } from ".";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateUnit } from "../helpers/CreateUnit";
import { updateUnit as fetchUpdateUnit } from '../helpers/updateUnit';
import { getData } from "../helpers/getData";

export const UnitForm: React.FC = () => {

    const unitId = useLocation().state
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

    //The behavior is like a onChange of the unit 
    const [removedThings, setRemovedThings] = useState<RemovedThings>({
        topics: [],
        subtopics: [],
        content: [],
    })

    const [isUpdate, setIsUpdate] = useState<boolean>(false)


    useEffect(() => {

        if (!unitId) {
            navigate('/Home')
        }

        const fetch = async () => {

            const data = await getData(unitId)

            return data

        }

        fetch().then((data) => {

            if (data.relativeId !== null) {
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
        })

    }, [])


    const [submit, setSubmit] = useState<number>(0)


    const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnit({
            ...unit,
            [e.target.name]: e.target.value
        })
    }

    const updateUnit = (newUnit: Unit) => {
        setUnit(newUnit);
    }

    /**
     * sources
    */

    const handleUnitSourceChange = (newSource: Source, index: number) => {
        const newSources = [...unit.sources];
        newSources[index] = newSource;
        setUnit({
            ...unit,
            sources: newSources
        })
    }

    const onAddUnitSource = () => {
        setUnit({
            ...unit,
            sources: [...unit.sources, { source: '', type: 0 }]
        })
    }

    const onRemoveSource = (index: number) => {
        const newSources = [...unit.sources];
        newSources.splice(index, 1);
        setUnit({
            ...unit,
            sources: newSources
        })
    }


    /**
     * submit
     */

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmit((currentSubmit) => currentSubmit + 1)
    }

    const redirect = (id: string, ruta: string) => {

        navigate(`/${ruta}`, { state: id })
    }

    const handleSendData = async () => {

        //Data from sessionStorage
        const storagedData: string | null = sessionStorage.getItem('data')
        const data: userCredentials = storagedData !== null ? JSON.parse(storagedData) : null

        //Data from params of sesionStorage
        const uid = data.teacherInfo.uid

        //Data from params of useLocation
        const id = unitId

        //Unit Data from form
        const unitData = unit


        if (isUpdate) {
            //Update unit
            await fetchUpdateUnit(unit, unit.teacherUid, unit.subjectId, removedThings)

            redirect(unit.subjectId, 'Units')
        } else {
            //Create unit
            await CreateUnit(unitData, uid, id)

            redirect(id, 'Units')
        }

        //clear sessionStorage
        // sessionStorage.removeItem('unit')

    }



    useEffect(() => {
        if (submit === 1)
            handleSendData()
        else if (submit > 1) {
            redirect(unitId, 'Units')
        }
    }, [submit])



    return (
        <>
            <form onSubmit={handleSubmit} className="block">
                <div id={unit.id}>
                    <fieldset className="border p-4 rounded-lg flex flex-col">
                        <legend className="text-lg font-semibold">Información de la unidad</legend>

                        <input
                            type="text"
                            placeholder="Titulo de la unidad"
                            name="unitTitle"
                            value={unit.unitTitle}
                            onChange={handleUnitChange}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Descripción"
                            name="description"
                            value={unit.description}
                            onChange={handleUnitChange}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Numero de la unidad"
                            name="unitNumber"
                            value={unit.unitNumber}
                            onChange={handleUnitChange}
                            required
                        />

                        <fieldset className="border p-4 rounded-lg">
                            <legend className="text-lg font-semibold">Recursos de la unidad</legend>

                            {unit.sources.map((source, index) => (
                                <SourceField
                                    level="unit"
                                    sourceData={source}
                                    idPrefix={index}
                                    key={index}
                                    onChange={(newSource) => handleUnitSourceChange(newSource, index)}
                                    onRemove={() => onRemoveSource(index)}
                                />
                            ))}
                            <button onClick={onAddUnitSource}>Agregar Fuente</button>


                        </fieldset>

                        <fieldset className="border p-4 rounded-lg">
                            <legend className="text-lg font-semibold">Temas de la unidad</legend>
                            <Topics
                                unit={unit}
                                updateUnit={updateUnit}
                                removedThings={removedThings}
                            />


                        </fieldset>
                    </fieldset>

                </div>
                <div className="flex justify-end">
                    <div className="md:w-[8rem] md:h-6">
                        <button
                            type='submit'
                            className="bg-primary hover:bg-sky-700 transition-colors cursor-pointer uppercase font-bold w-full text-white p-3 rounded-lg"
                        >
                            submit
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}


