import { SourceFieldProps } from "../types"
import { useState } from 'react';


//Use context?

export const SourceField: React.FC<SourceFieldProps> = ({
    sourceData,
    onChange,
    onRemove,

}) => {

    const [source, setSource] = useState(sourceData);

    const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSource({
            ...source,
            [e.target.name]: e.target.value
        })
        onChange({
            ...source,
            [e.target.name]: e.target.value
        })
    }




    return (
        <div className="source">
            <input
                type="text"
                placeholder="Recursos de apoyo"
                name="source"
                value={source.source}
                onChange={handleSourceChange}
                required
                className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />

            <select name="type" value={source.type} onChange={handleSourceChange} required>
                <option value={0}>Web</option>
                <option value={1}>Doc</option>
                <option value={2}>video</option>
            </select>

            <button onClick={onRemove}>Eliminar Fuente</button>
        </div>
    )
}
