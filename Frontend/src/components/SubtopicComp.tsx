import React, { useState } from 'react'
import { Content, Source, Subtopic, SubtopicFieldProps } from '../types';
import { SourceField } from './SourcesFieldComp'
import { ContentComp } from './ContentComp'
import { useEffect } from 'react';

export const SubtopicComp: React.FC<SubtopicFieldProps> = ({
    subtopicData,
    onChange,
    idPrefix,
    removedThings
}) => {

    const [subtopic, setSubtopic] = useState<Subtopic>(subtopicData);

    const [isUpdate, setIsUpdate] = useState<boolean>(false)

    useEffect(() => {
        if (sessionStorage.getItem('unit'))
            setIsUpdate(true)

    }, [])

    const handleSubtopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubtopic({
            ...subtopic,
            [e.target.name]: e.target.value
        })
        onChange({
            ...subtopic,
            [e.target.name]: e.target.value
        })
    }

    const [sources, setSources] = useState<Source[]>(subtopic.sources);

    const handleSubtopicSourceChange = (newSource: Source, index: number) => {
        const newSources = [...sources];
        newSources[index] = newSource;
        setSources(newSources);
        onChange({
            ...subtopic,
            sources: newSources
        })

        setSubtopic({
            ...subtopic,
            sources: newSources
        })

    }

    const onAddSource = () => {
        setSources([...sources, { source: '', type: 0 }])
    }

    const onRemoveSource = (index: number) => {
        const newSources = [...sources];
        newSources.splice(index, 1);
        setSources(newSources);
        onChange({
            ...subtopic,
            sources: newSources
        })
    }

    const [contentData, setContentData] = useState<Content[]>(subtopic.content);

    const handleContentChange = (newContent: Content, index: number) => {
        const newContentData = [...contentData];
        newContentData[index] = newContent;
        setContentData(newContentData);
        onChange({
            ...subtopic,
            content: newContentData
        })
        setSubtopic({
            ...subtopic,
            content: newContentData
        })
    }

    const onAddContent = () => {
        setContentData([...contentData, {
            id: '',
            contentTitle: '',
            description: '',
            subtopicId: '',
            contentNumber: 0,
            image: '',
            type: 0,
            url: '',
            relativeId: 0
        }])

    }

    const onRemoveContent = (index: number) => {
        const newContentData = [...contentData];
        newContentData.splice(index, 1);
        setContentData(newContentData);
        onChange({
            ...subtopic,
            content: newContentData
        })

        if (isUpdate) {
            if (!removedThings.content.includes(subtopic.content[index].id as string)
                || subtopic.content[index].id === '' || undefined) {
                removedThings.content.push(subtopic.content[index].id as string)
            }

        }

    }

    return (

        <>

            <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold">Subtemas</legend>
                <input
                    type="text"
                    placeholder="Titulo del subtema"
                    name="subtopicTitle"
                    value={subtopicData.subtopicTitle}
                    onChange={handleSubtopicChange}
                    required
                />


                <input
                    type="text"
                    placeholder="Descripcion del subtema"
                    name="description"
                    value={subtopicData.description}
                    onChange={handleSubtopicChange}
                    required
                />

                <input
                    type="number"
                    placeholder="Numero de subtema"
                    name="subtopicNumber"
                    value={subtopicData.subtopicNumber}
                    onChange={handleSubtopicChange}
                    required
                />

                <fieldset className='border p-4 rounded-lg'>
                    <legend className='text-lg font-semibold'>Recursos del subtema</legend>
                    {sources.map((source, index) => (
                        <div key={index}>
                            <SourceField
                                level='subtopic'
                                idPrefix={`${idPrefix}_${index}`}
                                sourceData={source}
                                onChange={(newSource) => handleSubtopicSourceChange(newSource, index)}
                                onRemove={() => onRemoveSource(index)}
                            />
                        </div>
                    ))}
                    <button onClick={onAddSource}>Agregar Fuente</button>
                </fieldset>

            </fieldset>

            <fieldset className='border p-4 rounded-lg'>
                <legend className='text-lg font-semibold'>Contenido general del curso</legend>
                {contentData.map((itemContent, index) => (
                    <div key={index}>
                        <ContentComp
                            contentData={itemContent}
                            onChange={(newContent) => { handleContentChange(newContent, index) }}
                            idPrefix={index}
                            onRemove={() => onRemoveContent(index)}
                        />

                        <button onClick={() => onRemoveContent(index)}>Eliminar contenido</button>
                    </div>

                ))}
                <button onClick={onAddContent}>Agregar contenido</button>
            </fieldset>



        </>
    )
}

