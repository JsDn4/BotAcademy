import { TopicCompForm } from '.';
import { Topic, TopicsProps } from '../types';
import { useState, useEffect } from 'react';

export const Topics: React.FC<TopicsProps> = ({
    unit,
    updateUnit,
    removedThings
}) => {

    const [isUpdate, setIsUpdate] = useState<boolean>(false)

    useEffect(() => {
        if (sessionStorage.getItem('unit')) {
            setIsUpdate(true)
        }



    }, [])

    const updateTopic = (newTopic: Topic, index: number) => {
        const newTopics = [...unit.topics];
        newTopics[index] = newTopic;
        updateUnit({
            ...unit,
            topics: newTopics
        })
    }

    const addTopic = () => {
        const newTopic: Topic = {
            id: '',
            description: '',
            topicNumber: 0,
            topicTitle: '',
            sources: [],
            subtopics: [],
            unitId: '',
            relativeId: 0
        }

        updateUnit({
            ...unit,
            topics: [...unit.topics, newTopic]
        })
    }

    const removeTopic = (index: number) => {
        event?.preventDefault();
        const newTopics = [...unit.topics];
        newTopics.splice(index, 1);
        updateUnit({
            ...unit,
            topics: newTopics
        })

        if (isUpdate) {
            if (!removedThings.topics.includes(unit.topics[index].id as string)
                || unit.topics[index].id === '' || undefined) {
                removedThings.topics.push(unit.topics[index].id as string)
            }

        }
    }

    return (
        <div className='topics'>
            {unit.topics.map((topic, index) => (
                <div key={index}>
                    <TopicCompForm
                        topicData={topic}
                        onChange={(newTopic) => updateTopic(newTopic, index)}
                        onRemove={() => removeTopic(index)}
                        removedThings={removedThings}

                    />

                    <button onClick={() => removeTopic(index)}>Eliminar tema</button>
                </div>
            ))}
            <button onClick={addTopic}>Agregar Tema</button>
        </div>
    );
}
