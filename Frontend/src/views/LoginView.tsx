import { useEffect, useState } from "react"
import { LoginForm } from "../components"

import { useNavigate } from "react-router-dom"

export const LoginView: React.FC = () => {

    const [randomBgImage, setRandomBgImage] = useState<string>('')

    const navigate = useNavigate()

    const onLoging = () => {
        navigate("Home")
    }

    useEffect(() => {

        const base = "/images/login/"
        const imgUrlsArray = [
            `${base}Hero1.jpg`,
            `${base}Hero2.jpg`,
            `${base}Hero3.jpg`
        ]

        const randomIndex = Math.floor(Math.random() * imgUrlsArray.length)

        setRandomBgImage(`${imgUrlsArray[randomIndex]}`)

    }, [])


    const backgroundStyle = {
        backgroundImage: `url(${randomBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return (
        <>
            <div style={backgroundStyle} className={`flex justify-center items-center min-h-screen`}>
                <LoginForm onLogin={onLoging} />
            </div >
        </>
    )
}