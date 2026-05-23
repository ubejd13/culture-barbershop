import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Services from './sections/Services'
import Barbers from './sections/Barbers'
import Appointments from './sections/Appointments'
import LocationContact from './sections/LocationContact'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'

function HomePage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Barbers />
        <Appointments />
        <LocationContact />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
