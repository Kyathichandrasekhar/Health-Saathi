import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import MapView from '../components/MapView'
import HospitalCard from '../components/HospitalCard'

export default function Home() {
  const [realHospitals, setRealHospitals] = useState<any[]>([])
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(true)
  const handleHospitalsLoaded = useCallback((hospitals: any[]) => {
    setRealHospitals(hospitals)
    setIsLoadingHospitals(false)
  }, [])

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
                <Activity className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-primary-300">Smart Healthcare Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-white">Your Health,</span>
                <br />
                <span className="gradient-text">Our Priority</span>
              </h1>

              <p className="mt-6 text-lg text-dark-300 leading-relaxed max-w-lg">
                Find nearby hospitals, book appointments, skip the queue, and get instant health assistance — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/booking"
                  className="btn-gradient flex items-center justify-center gap-2 text-base"
                >
                  Book Appointment
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/assistant"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
                >
                  Health Assistant
                </Link>
              </div>

            </motion.div>

            {/* Right: Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[500px] rounded-2xl overflow-hidden shadow-glass-lg"
            >
              <MapView onHospitalsLoaded={handleHospitalsLoaded} />
            </motion.div>
          </div>
        </div>
      </section>



      {/* Nearby Hospitals */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Nearby Hospitals</h2>
              <p className="text-dark-400 mt-1">Based on your location</p>
            </div>
            <Link
              to="/booking"
              className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingHospitals ? (
              <div className="col-span-full flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : realHospitals.length > 0 ? (
              realHospitals.slice(0, 4).map((hospital: any, i: number) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <HospitalCard {...hospital} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-dark-300 py-10">
                No hospitals found near your location.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to skip the queue?
            </h2>
            <p className="text-dark-300 mb-8 max-w-lg mx-auto">
              Join thousands of patients who save time with our smart queue management system.
            </p>
            <Link to="/signup" className="btn-gradient text-lg px-8 py-4 inline-flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
