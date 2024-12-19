import { NavbarProps } from '../types'
import { Navbar } from './Navbar'
export const Header: React.FC<NavbarProps> = ({ flag, id }) => {

    return (
        <>
            <header className='header'>
                <Navbar flag={flag} id={id} />
            </header>

        </>
    )

}