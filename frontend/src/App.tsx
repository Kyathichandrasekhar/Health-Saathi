import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Booking from './pages/Booking'
import Payment from './pages/Payment'
import Ticket from './pages/Ticket'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Assistant from './pages/Assistant'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/ticket/:appointmentId" element={<Ticket />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/booking/:hospitalId" element={<Booking />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/assistant" element={<Assistant />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
