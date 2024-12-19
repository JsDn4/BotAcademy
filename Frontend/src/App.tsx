import * as view from "./views"
import React from 'react'
import { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate
} from "react-router-dom"

const requireAuth = (WrappedComponent: React.FC) => {
    const AuthComponent: React.FC = (props) => {
        const [isLoggedIn, setIsLoggedIn] = useState(false)
        const navigate = useNavigate()

        useEffect(() => {
            const data = sessionStorage.getItem("data")

            if (data) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
                navigate('/')
            }
        }, [navigate])

        if (isLoggedIn) {
            return <WrappedComponent {...props} />
        }

        return null
    }

    return AuthComponent
}

const BotAcademy: React.FC = () => {

    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' Component={view.LoginView} />
                    <Route path="/Home" Component={requireAuth(view.HomeView)} />
                    <Route path="/Units" Component={requireAuth(view.UnitsView)} />
                    <Route path="/Add" Component={requireAuth(view.FormAddUpdate)} />
                    <Route path="/Update" Component={requireAuth(view.FormAddUpdate)} />
                </Routes>
            </Router>
        </>
    )

}



export const App: React.FC = () => {
    return (
        <BotAcademy />
    )
}