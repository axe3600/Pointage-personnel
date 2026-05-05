import { useState, useEffect } from "react"
import { FiLogOut } from "react-icons/fi"
import axios from "axios"

function LeftPanel({ pointages, leaves, refreshData }) {

  const [user, setUser] = useState(null)

  // =========================
  // 🔥 USER CONNECTÉ
  // =========================
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"))
    if (savedUser) setUser(savedUser)
  }, [])

  // =========================
  // 🔥 HORLOGE TEMPS RÉEL
  // =========================
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // =========================
  // 🔥 ETATS POINTAGE
  // =========================
  const [arrival, setArrival] = useState(null)
  const [employee, setEmployee] = useState("")

  // =========================
  // 🔐 LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("isAuth")
    window.location.reload()
  }

  // =========================
  // 🔹 FORMATAGE
  // =========================
  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const formatDate = (date) =>
    date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  // =========================
  // ✅ ARRIVÉE
  // =========================
  const handleArrival = () => {
    if (!employee) return alert("Entre un nom")
    setArrival(new Date())
  }

  // =========================
  // ✅ DÉPART → MONGO DB
  // =========================
  const handleDeparture = async () => {

    if (!arrival) return alert("Pointer arrivée d'abord")

    const now = new Date()
    const diff = (now - arrival) / (1000 * 60 * 60)
    const hours = diff.toFixed(2)

    const isLate =
      arrival.getHours() > 8 ||
      (arrival.getHours() === 8 && arrival.getMinutes() > 0)

    try {
      await axios.post(
        "https://pointage-personnel.onrender.com/api/pointages/manual",
        {
          firstName: employee,
          lastName: "",
          arrival: arrival.toLocaleTimeString(),
          departure: now.toLocaleTimeString(),
          hours: `${hours}h`,
          status: isLate ? "En retard" : "Présent"
        }
      )

      refreshData() // 🔥 recharge depuis MongoDB

    } catch (err) {
      alert("Erreur pointage ❌")
    }

    setArrival(null)
    setEmployee("")
  }

  // =========================
  // ❌ ABSENCE → MONGO DB
  // =========================
  const handleAbsence = async () => {

    if (!employee) return alert("Entre un nom")

    try {
      await axios.post(
        "https://pointage-personnel.onrender.com/api/pointages/manual",
        {
          firstName: employee,
          lastName: "",
          category: "absence",
          status: "Absent",
          arrival: "-",
          departure: "-",
          hours: "-",
          reason: "Absent"
        }
      )

      refreshData()

    } catch (err) {
      alert("Erreur absence ❌")
    }

    setEmployee("")
  }

  // =========================
  // 🔥 STATS (basé sur MongoDB)
  // =========================
  const today = new Date().toLocaleDateString()

  const todayPointages = pointages.filter(p => p.date === today)

  const totalHours = todayPointages.reduce((acc, p) => {
    const h = parseFloat(p.hours) || 0
    return acc + h
  }, 0)

  const formatHours = (h) => {
    const hours = Math.floor(h)
    const minutes = Math.round((h - hours) * 60)
    return `${hours}h ${minutes}min`
  }

  const lateCount = todayPointages.filter(p => p.status === "En retard").length

  const workedDays = todayPointages.length

  const absents = pointages.filter(
    p => p.category === "absence" && p.date === today
  ).length

  const total = workedDays + absents

  const presenceRate = total === 0
    ? 0
    : Math.round((workedDays / total) * 100)

  const onTime = todayPointages.filter(p => p.status === "Présent").length

  const punctuality =
    todayPointages.length === 0
      ? 0
      : Math.round((onTime / todayPointages.length) * 100)

  return (
    <div className="space-y-6">

      {/* 🔹 PROFIL */}
      <div className="bg-white p-5 rounded-xl shadow">

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Mon Profil</h3>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full"
          >
            <FiLogOut size={14} />
            Déconnexion
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="bg-purple-500 text-white w-12 h-12 flex items-center justify-center rounded-full">
            {user ? user.firstName[0] : "U"}
          </div>

          <div>
            <h4>{user ? `${user.firstName} ${user.lastName}` : "Utilisateur"}</h4>
            <span className="text-sm text-gray-500">Admin</span>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p>📧 {user?.email}</p>
          <p>🆔 {user?.id}</p>
          <p>⏰ {user?.lastLogin}</p>
        </div>
      </div>

      {/* 🔥 POINTAGE */}
      <div className="bg-blue-50 p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Pointage</h3>

        <div className="bg-white p-4 rounded-lg text-center mb-4">
          <h2 className="text-2xl font-bold">{formatTime(currentTime)}</h2>
          <p className="text-sm text-gray-500">{formatDate(currentTime)}</p>
        </div>

        <input
          type="text"
          placeholder="Nom employé"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
        />

        <div className="flex justify-between bg-green-100 p-3 rounded mb-3">
          <span>Arrivée</span>
          <span>{arrival ? formatTime(arrival) : "--:--"}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleArrival}
            className="flex-1 bg-green-500 text-white p-2 rounded"
          >
            Pointer arrivée
          </button>

          <button
            onClick={handleDeparture}
            className="flex-1 bg-black text-white p-2 rounded"
          >
            Pointer départ
          </button>
        </div>

        <button
          onClick={handleAbsence}
          className="w-full bg-red-500 text-white p-2 rounded mt-3"
        >
          Marquer absent
        </button>
      </div>

      {/* 🔹 STATS */}
      <div className="bg-white p-5 rounded-2xl shadow">

        <h3 className="font-semibold mb-4">Mes statistiques</h3>

        <div className="grid grid-cols-2 gap-4">

          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">📈 Heures du jour</p>
            <h3 className="text-xl font-bold text-blue-600">
              {formatHours(totalHours)}
            </h3>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">🕒 Heures totales</p>
            <h3 className="text-xl font-bold text-green-600">
              {formatHours(totalHours)}
            </h3>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">📅 Retards</p>
            <h3 className="text-xl font-bold text-purple-600">
              {lateCount}
            </h3>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">🏅 Taux présence</p>
            <h3 className="text-xl font-bold text-orange-500">
              {presenceRate}%
            </h3>
          </div>

        </div>

        <div className="border-t my-4"></div>

        <div className="space-y-2 text-sm text-gray-600">

          <div className="flex justify-between">
            <span>Jours travaillés</span>
            <span className="font-semibold">{workedDays}</span>
          </div>

          <div className="flex justify-between">
            <span>Absents</span>
            <span className="text-red-500">{absents}</span>
          </div>

          <div className="flex justify-between">
            <span>Ponctualité</span>
            <span className="text-green-600 font-semibold">
              {punctuality}%
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}

export default LeftPanel;