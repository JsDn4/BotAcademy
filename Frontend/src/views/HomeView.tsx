import { Header } from "../components/Header"
import { SubjectsGrid } from "../components/SubjectsGrid"

export const HomeView: React.FC = () => {
    return (
        <>
            <Header />
            <h3 className="text-2xl font-bold text-blue-500 text-center">Home</h3>

            <main className="mt-5">
                <p className="text-2xl font-bold text-center">Materias disponibles</p>
                <SubjectsGrid />
            </main>
        </>
    )
}
