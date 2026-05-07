import { useState, useEffect } from "react"
import axios from "axios"

import Navbar from "../components/layout/Navbar"
import StatsCards from "../components/dashboard/StatsCards"
import LeftPanel from "../components/dashboard/LeftPanel"
import RightPanel from "../components/dashboard/RightPanel"
import Footer from "../components/layout/Footer"
import LoginModal from "../components/ui/LoginModal"

function Dashboard() {

    // fonction DELETE
  const deleteLeave = async (id) => {
    try {
      await axios.delete(`${API}/leaves/${id}`)
      await fetchLeaves()
    } catch (err) {
      console.log(err)
      alert("Erreur suppression congé ❌")
    }
  }

  // =========================
  // 🔐 AUTH
  // =========================
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAuth") === "true"
  )

  // =========================
  // 🔥DATA BACKEND
  // =========================
  const [leaves, setLeaves] = useState([])
  const [pointages, setPointages] = useState([])

  // =========================
  // 🌍 API URL
  // =========================
  const API = "https://pointage-personnel.onrender.com/api"

  // =========================
  // 🔥 FETCH POINTAGES
  // =========================
  const fetchPointages = async () => {

    try {

      const res = await axios.get(`${API}/pointages`)

      // 🔥 sécurisation tableau
      const data = Array.isArray(res.data)
        ? res.data
        : []

      // 🔥 normalisation des données
      const formattedData = data.map((item) => ({
        ...item,

        // 🔥 date ISO obligatoire
        date: item.date || new Date().toISOString(),

        // 🔥 valeurs fallback
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        arrival: item.arrival || "-",
        departure: item.departure || "-",
        hours: item.hours || "-",
        status: item.status || "Présent",
        reason: item.reason || "",
        category: item.category || "pointage"
      }))

      setPointages(formattedData)

    } catch (err) {

      console.log("Erreur pointages ❌")
      console.log(err)

      setPointages([])
    }
  }

  // =========================
  // 🔥 FETCH CONGÉS
  // =========================
  const fetchLeaves = async () => {

    try {

      const res = await axios.get(`${API}/leaves`)

      // 🔥 sécurisation tableau
      const data = Array.isArray(res.data)
        ? res.data
        : []

      // 🔥 normalisation données congés
      const formattedLeaves = data.map((leave) => ({
        ...leave,

        // 🔥 IMPORTANT pour Today + History
        date:
          leave.date ||
          leave.createdAt ||
          leave.startDate ||
          new Date().toISOString(),

        firstName: leave.firstName || "",
        lastName: leave.lastName || "",
        type: leave.type || "Congé",
        reason: leave.reason || "",
        status: leave.status || "En attente",
        category: "leave"
      }))

      setLeaves(formattedLeaves)

    } catch (err) {

      console.log("Erreur congés ❌")
      console.log(err)

      setLeaves([])
    }
  }

  // =========================
  // 🔥 AJOUT CONGÉ
  // =========================
  const addLeave = async (leaveData) => {

    try {

      const payload = {
        ...leaveData,

        // 🔥 date ISO obligatoire
        date: new Date().toISOString(),

        status: "En attente",
        category: "leave"
      }

      const res = await axios.post(
        `${API}/leaves`,
        payload
      )

      // 🔥 vérifier succès API
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Erreur API")
      }

      // 🔥 refresh auto
      await fetchLeaves()

    } catch (err) {

      console.log(err)

      alert("Erreur envoi congé ❌")
    }
  }

  // =========================
  // 🔥 REFRESH GLOBAL
  // =========================
  const refreshData = async () => {

    await Promise.all([
      fetchPointages(),
      fetchLeaves()
    ])
  }

  // =========================
  // 🔥 LOAD INITIAL
  // =========================
  useEffect(() => {

    refreshData()

  }, [])

  // =========================
  // 🔥 AUTO REFRESH
  // =========================
  useEffect(() => {

    const interval = setInterval(() => {

      refreshData()

    }, 5000)

    return () => clearInterval(interval)

  }, [])

  // =========================
  // 🔥 LISTENER SCAN QR CODE
  // =========================
  useEffect(() => {

    const handleStorage = (e) => {

      // 🔥 uniquement refresh scan
      if (e.key === "refresh") {

        refreshData()
      }
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
    }

  }, [])

  // =========================
  // 🔐 LOGIN
  // =========================
  if (!isAuth) {
    return (
      <LoginModal onLogin={() => setIsAuth(true)} />
    )
  }

  // =========================
  // 🔥 UI
  // =========================
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