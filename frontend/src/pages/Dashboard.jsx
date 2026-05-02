import { useState, useEffect } from "react"
import Navbar from "../components/layout/Navbar"
import StatsCards from "../components/dashboard/StatsCards"
import LeftPanel from "../components/dashboard/LeftPanel"
import RightPanel from "../components/dashboard/RightPanel"
import Footer from "../components/layout/Footer"
import LoginModal from "../components/ui/LoginModal"

function Dashboard() {

  // 🔐 AUTH
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem("isAuth") === "true"
  })

  const handleLogin = () => {
    setIsAuth(true)
  }

  // 🔥 CONGÉS
  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem("leaves")
    return saved ? JSON.parse(saved) : []
  })

  // 🔥 POINTAGES
  const [pointages, setPointages] = useState(() => {
    const saved = localStorage.getItem("pointages")
    return saved ? JSON.parse(saved) : []
  })

  // Pointage
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = JSON.parse(localStorage.getItem("pointages")) || []
      setPointages(saved)
    }, 1000) // refresh chaque seconde
  
    return () => clearInterval(interval)
  }, [])


  // 💾 SAVE
  useEffect(() => {
    localStorage.setItem("leaves", JSON.stringify(leaves))
  }, [leaves])

  useEffect(() => {
    localStorage.setItem("pointages", JSON.stringify(pointages))
  }, [pointages])

  // ➕ AJOUT CONGÉ
  const addLeave = (leave) => {
    setLeaves((prev) => [...prev, leave])
  }

  // ➕ AJOUT POINTAGE
  const addPointage = (pointage) => {
    setPointages((prev) => [...prev, pointage])
  }

  // ❌ DELETE CONGÉ
  const deleteLeave = (index) => {
    setLeaves((prev) => prev.filter((_, i) => i !== index))
  }

  if (!isAuth) {
    return <LoginModal onLogin={handleLogin} />
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">

      <Navbar addLeave={addLeave} />

      <div className="flex-grow">

        <StatsCards leaves={leaves} pointages={pointages}/>

        <div className="max-w-[1400px] mx-auto px-6 mt-6 grid grid-cols-12 gap-8">

          {/* LEFT */}
          <div className="col-span-4">
            {/* ✅ FIX IMPORTANT */}
            <LeftPanel 
              addPointage={addPointage}
              pointages={pointages}
              leaves={leaves}
            />
          </div>

          {/* RIGHT */}
          <div className="col-span-8">
            <RightPanel 
              leaves={leaves}
              pointages={pointages}
              deleteLeave={deleteLeave}
            />
          </div>

        </div>

      </div>

      <Footer />
    </div>
  )
}

export default Dashboard;