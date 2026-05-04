import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/layout/Navbar"
import StatsCards from "../components/dashboard/StatsCards"
import LeftPanel from "../components/dashboard/LeftPanel"
import RightPanel from "../components/dashboard/RightPanel"
import Footer from "../components/layout/Footer"
import LoginModal from "../components/ui/LoginModal"

function Dashboard() {

  // 🔐 AUTH
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAuth") === "true"
  )

 // 🔥 CONGÉS
  const [leaves, setLeaves] = useState([])
  const [pointages, setPointages] = useState([])

  // 🔥 FETCH POINTAGES (temps réel)
  const fetchPointages = async () => {
    try {
      const res = await axios.get(
        "https://pointage-personnel.onrender.com/api/pointages"
      )
      setPointages(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const fetchPointages = async () => {
      try {
        const res = await axios.get(
          "https://pointage-personnel.onrender.com/api/pointages"
        )
        setPointages(res.data)
      } catch (err) {
        console.log("Erreur chargement pointages")
      }
    }
  
    // 🔥 premier chargement
    fetchPointages()
  
    // 🔥 refresh auto toutes les 2s
    const interval = setInterval(fetchPointages, 2000)
  
    // 🔥 écoute du scan (IMPORTANT 🔥)
    const handleStorage = (e) => {
      if (e.key === "refresh") {
        fetchPointages()
      }
    }
  
    window.addEventListener("storage", handleStorage)
  
    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  if (!isAuth) return <LoginModal onLogin={() => setIsAuth(true)} />

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">

      <Navbar addLeave={(l) => setLeaves(prev => [...prev, l])} />

      <div className="flex-grow">

        <StatsCards leaves={leaves} pointages={pointages} />

        <div className="max-w-[1400px] mx-auto px-6 mt-6 grid grid-cols-12 gap-8">

          <div className="col-span-4">
          <LeftPanel
  pointages={pointages}
  leaves={leaves}
  addPointage={(p) => setPointages(prev => [p, ...prev])}
/>
          </div>

          <div className="col-span-8">
            <RightPanel
              leaves={leaves}
              pointages={pointages}
              deleteLeave={(i) =>
                setLeaves(prev => prev.filter((_, idx) => idx !== i))
              }
            />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard;