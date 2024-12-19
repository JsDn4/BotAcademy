import { useState, useEffect } from 'react';
import { Source, Subtopic, Topic, TopicCompFormProps } from '../types';
import { SourceField } from "./SourcesFieldComp"
import { SubtopicComp } from "."

export const TopicCompForm: React.FC<TopicCompFormProps> = ({
    topicData,
    onChange,
    removedThings,
}) => {

    const [topic, setTopic] = useState<Topic>(topicData);

    const [isUpdate, setIsUpdate] = useState<boolean>(false)

    useEffect(() => {
        if (sessionStorage.getItem('unit'))
            setIsUpdate(true)

    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTopic({
            ...topic,
            [e.target.name]: e.target.value
        })
        onChange({
            ...topic,
            [e.target.name]: e.target.value
        })
    }

    const [sources, setSources] = useState<Source[]>(topic.sources);

    const handleSourceChange = (newSource: Source, index: number) => {
        const newSources = [...sources];
        newSources[index] = newSource;
        setSources(newSources);
        onChange({
            ...topic,
            sources: newSources
        })
        setTopic({
            ...topic,
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
            ...topic,
            sources: newSources
        })
        setTopic({
            ...topic,
            sources: newSources
        })

    }

    const [subtopics, setSubtopics] = useState<Subtopic[]>(topic.subtopics);

    const handleSubtopicChange = (newSubtopic: Subtopic, index: number) => {
        const newSubtopics = [...subtopics];
        newSubtopics[index] = newSubtopic;
        setSubtopics(newSubtopics);
        onChange({
            ...topic,
            subtopics: newSubtopics
        })

        setTopic({
            ...topic,
            subtopics: newSubtopics
        })
    }

    const onAddSubtopic = () => {
        setSubtopics([...subtopics,
        {
            id: '',
            description: '',
            sources: [],
            subtopicNumber: 0,
            subtopicTitle: '',
            topicId: '',
            content: [],
            relativeId: 0
        }])
    }

    const onRemoveSubtopic = (index: number) => {
        const newSubtopics = [...subtopics];
        newSubtopics.splice(index, 1);
        setSubtopics(newSubtopics);
        onChange({
            ...topic,
            subtopics: newSubtopics
        })

        if (isUpdate) {
            if (!removedThings.subtopics.includes(topic.subtopics[index].id as string)
                || topic.subtopics[index].id === '' || undefined) {
                removedThings.subtopics.push(topic.subtopics[index].id as string)
            }
        }

    }



    return (
        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold">Tema</legend>
            <input
                type="text"
                placeholder="Titulo del tema"
                name="topicTitle"
                value={topicData.topicTitle}
                onChange={handleInputChange}
                required
            />


            <input
                type="text"
                placeholder="Descripcion del tema"
                name="description"
                value={topicData.description}
                onChange={handleInputChange}
                required
            />

            <input
                type="text"
                placeholder="Numero de tema"
                name="topicNumber"
                value={topicData.topicNumber}
                onChange={handleInputChange}
                required
            />


            <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold">Recursos del tema</legend>
                {sources.map((source, index) => (
                    <SourceField
                        key={index}
                        sourceData={source}
                        onChange={(newSource) => handleSourceChange(newSource, index)}
                        onRemove={() => onRemoveSource(index)}
                        idPrefix={index}
                        level="topic"
                    />
                ))}
                <button onClick={onAddSource}>Agregar Fuente</button>
            </fieldset>


            <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold">Subtemas referentes al tema</legend>
                {subtopics.map((subtopic, index) => (
                    <div key={index}>
                        <SubtopicComp
                            subtopicData={subtopic}
                            onChange={(newSubtopic) => handleSubtopicChange(newSubtopic, index)}
                            onRemove={() => onRemoveSubtopic(index)}
                            idPrefix={index}
                            subtopicSources={subtopic.sources}
                            onSubtopicChange={(updatedSubtopic) => handleSubtopicChange(updatedSubtopic, index)}
                            removedThings={removedThings}
                        />
                        <button onClick={() => onRemoveSubtopic(index)}>Eliminar subtema</button>
                    </div>
                ))}
                <button onClick={onAddSubtopic}>Agregar subtema</button>
            </fieldset>


        </fieldset>
    )
}

