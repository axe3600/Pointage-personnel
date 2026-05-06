import { useState, useEffect } from "react"
import axios from "axios"

import Navbar from "../components/layout/Navbar"
import StatsCards from "../components/dashboard/StatsCards"
import LeftPanel from "../components/dashboard/LeftPanel"
import RightPanel from "../components/dashboard/RightPanel"
import Footer from "../components/layout/Footer"
import LoginModal from "../components/ui/LoginModal"

function Dashboard() {

  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAuth") === "true"
  )

  // 🔥 DATA BACKEND
  const [leaves, setLeaves] = useState([])
  const [pointages, setPointages] = useState([])

  // =========================
  // 🔥 FETCH POINTAGES
  // =========================
  const fetchPointages = async () => {
    try {
      const res = await axios.get(
        "https://pointage-personnel.onrender.com/api/pointages"
      )
      setPointages(res.data)
    } catch (err) {
      console.log("Erreur pointages ❌")
    }
  }

  // =========================
  // 🔥 FETCH CONGÉS
  // =========================
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        "https://pointage-personnel.onrender.com/api/leaves"
      )
      setLeaves(res.data)
    } catch (err) {
      console.log("Erreur congés ❌")
    }
  }

  // =========================
  // 🔥 AJOUT CONGÉ (FIX ERREUR)
  // =========================
  const addLeave = async (leaveData) => {
    try {
      await axios.post(
        "https://pointage-personnel.onrender.com/api/leaves",
        leaveData
      )

      fetchLeaves() // refresh après ajout
    } catch (err) {
      alert("Erreur envoi congé ❌")
    }
  }

  // =========================
  // 🔥 REFRESH GLOBAL
  // =========================
  const refreshData = () => {
    fetchPointages()
    fetchLeaves()
  }

  // =========================
  // 🔥 LOAD INITIAL + AUTO REFRESH
  // =========================
  useEffect(() => {
    refreshData()

    const interval = setInterval(refreshData, 5000)
    return () => clearInterval(interval)
  }, [])

  // =========================
  // 🔥 LISTEN SCAN (IMPORTANT)
  // =========================
  useEffect(() => {
    const handleStorage = () => {
      refreshData()
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  if (!isAuth) return <LoginModal onLogin={() => setIsAuth(true)} />

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">

      {/* 🔥 FIX: vraie fonction POST */}
      <Navbar addLeave={addLeave} />

      <div className="flex-grow">

        <StatsCards leaves={leaves} pointages={pointages} />

        <div className="max-w-[1400px] mx-auto px-6 mt-6 grid grid-cols-12 gap-8">

          <div className="col-span-4">
            {/* 🔥 FIX: refreshData envoyé */}
            <LeftPanel
              pointages={pointages}
              leaves={leaves}
              refreshData={refreshData}
            />
          </div>

          <div className="col-span-8">
            <RightPanel
              leaves={leaves}
              pointages={pointages}
              deleteLeave={refreshData}
            />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard;