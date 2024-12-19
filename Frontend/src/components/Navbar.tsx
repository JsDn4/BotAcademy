import { Link } from 'react-router-dom'
import { NavbarProps } from '../types'

export const Navbar: React.FC<NavbarProps> = ({ flag, id }) => {

    return (
        <>
            <div className="max-w-screen-xl mx-auto">
                {/* Contenedor */}
                <div className="w-10/12 mx-auto">

                    <div className="flex justify-between items-center">
                        <div className="flex-1">

                            <Link
                                to={`/Home`}
                                key={`Home`}
                                className="flex items-center"
                            >

                                <img src="/hero/botAcademy.png" alt="hero" />
                                <span className="font-bold text-primary">Bot Academy</span>

                            </Link>

                        </div>

                        <nav className="flex justify-end flex-1">

                            {flag &&
                                <Link
                                    to={`/Add`}
                                    className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-3'
                                    state={id}
                                >

                                    <span>Agregar</span>
                                </Link>
                            }

                            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">Logout</button>




                        </nav>
                    </div>

                </div>

            </div>
        </>
    )
}