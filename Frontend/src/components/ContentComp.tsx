import { ContentFieldProps } from '../types';
import React from 'react'

export const ContentComp: React.FC<ContentFieldProps> = ({
    contentData,
    onChange,
}) => {

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange({
            ...contentData,
            [e.target.name]: e.target.value
        })
    }



    return (

        <>
            <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold">Contenido</legend>

                <input
                    type='text'
                    placeholder='Titulo del contenido'
                    name='contentTitle'
                    value={contentData.contentTitle}
                    onChange={handleContentChange}
                    required
                />

                <input
                    type='text'
                    placeholder='Descripcion del contenido'
                    name='description'
                    value={contentData.description}
                    onChange={handleContentChange}
                    required
                />

                <input
                    type='text'
                    placeholder='Link de imagen'
                    name='image'
                    value={contentData.image}
                    onChange={handleContentChange}
                    required
                />

                <select required name="type" value={contentData.type} onChange={handleContentChange}>
                    <option value={0}>Web</option>
                    <option value={1}>Doc</option>
                    <option value={2}>video</option>
                </select>

                <input
                    type='text'
                    placeholder='Url del contenido'
                    name='url'
                    value={contentData.url}
                    onChange={handleContentChange}
                    required
                />

            </fieldset>

        </>
    )
}


