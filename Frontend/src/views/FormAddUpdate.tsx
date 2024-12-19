import * as comp from '../components'
import { Header } from '../components/Header'

export const FormAddUpdate: React.FC = ({ }) => {
  return (
    <>
      <Header />
      <h4 className='text-2xl font-bold text-blue-500 text-center'>Acciones en la unidad</h4>
      <main className='w-[90%] mx-auto'>
        <comp.UnitForm />
      </main>
    </>
  )
}
