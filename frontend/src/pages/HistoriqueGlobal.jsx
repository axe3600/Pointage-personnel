import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

// 🔥 ICÔNES
import {
  FaUserCheck,
  FaUserTimes,
  FaClock,
  FaMugHot,
  FaCalendarAlt,
  FaDollarSign,
  FaArrowLeft
} from "react-icons/fa"

function HistoriqueGlobal() {

  const navigate = useNavigate()

  // =========================
  // 🔥 ONGLET ACTIF
  // =========================
  const [tab, setTab] = useState("history")

  // =========================
  // 🔥 DONNÉES BACKEND
  // =========================
  const [pointages, setPointages] = useState([])
  const [leaves, setLeaves] = useState([])

  // =========================
  // 🔥 FILTRES PÉRIODE
  // =========================
  const currentDate = new Date()

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth()
  )

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  )

  // =========================
  // 🔥 URL API
  // =========================
  const API = "https://pointage-personnel.onrender.com/api"

  // =========================
  // 🔥 CHARGEMENT INITIAL
  // =========================
  useEffect(() => {
    fetchData()
  }, [])

  // =========================
  // 🔥 FETCH GLOBAL
  // =========================
  const fetchData = async () => {

    try {

      const [pointagesRes, leavesRes] = await Promise.all([
        axios.get(`${API}/pointages`),
        axios.get(`${API}/leaves`)
      ])

      setPointages(pointagesRes.data || [])
      setLeaves(leavesRes.data || [])

    } catch (err) {

      console.log("Erreur chargement historique ❌")
      console.log(err)
    }
  }

  // =========================
  // 🔥 FILTRE POINTAGES
  // =========================
  const monthlyPointages = pointages.filter((p) => {

    const d = new Date(p.date)

    return (
      d.getMonth() === Number(selectedMonth) &&
      d.getFullYear() === Number(selectedYear)
    )
  })

  // =========================
  // 🔥 FILTRE CONGÉS
  // =========================
  const monthlyLeaves = leaves.filter((l) => {

    const d = new Date(l.date)

    return (
      d.getMonth() === Number(selectedMonth) &&
      d.getFullYear() === Number(selectedYear)
    )
  })

  // =========================
  // 🔥 STATS
  // =========================
  const presences = monthlyPointages.filter(
    p =>
      p.status === "Présent" ||
      p.status === "En retard"
  ).length

  const absences = monthlyPointages.filter(
    p => p.category === "absence"
  ).length

  const retards = monthlyPointages.filter(
    p => p.status === "En retard"
  ).length

  const conges = monthlyLeaves.length

  // =========================
  // 🔥 MOIS
  // =========================
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ]

  return (

    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "#ee821e9d"
      }}
    >

      {/* ========================= */}
      {/* 🔥 TOP BAR */}
      {/* ========================= */}
      <div className="flex justify-between items-center mb-8">

        {/* 🔥 RETOUR */}
        <button
          onClick={() => navigate("/")}
          className="
            flex
            items-center
            gap-3
            bg-gradient-to-r
            from-orange-500
            to-pink-500
            text-white
            px-6
            py-3
            rounded-2xl
            shadow-lg
            hover:scale-105
            hover:shadow-2xl
            transition-all
            duration-300
            font-semibold
          "
        >
          <FaArrowLeft />
          Retour Accueil
        </button>

        {/* 🔥 ONGLETS */}
        <div className="flex gap-3">

          {/* HISTORIQUE */}
          <button
            onClick={() => setTab("history")}
            className={`px-5 py-3 rounded-2xl text-sm flex items-center gap-2 transition ${
              tab === "history"
                ? "bg-black text-white shadow-lg"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            <FaCalendarAlt />
            Historique Mensuel
          </button>

          {/* SALAIRES */}
          <button
            onClick={() => setTab("salary")}
            className={`px-5 py-3 rounded-2xl text-sm flex items-center gap-2 transition ${
              tab === "salary"
                ? "bg-black text-white shadow-lg"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            <FaDollarSign />
            Calcul des Salaires
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* 🔥 HISTORIQUE */}
      {/* ================================================= */}
      {tab === "history" && (

        <div>

          {/* 🔥 HEADER HERO */}
          <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-xl mb-10">

            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-3 mb-3">

                  <div className="bg-orange-500 text-white p-3 rounded-2xl shadow-lg">
                    <FaCalendarAlt className="text-2xl" />
                  </div>

                  <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold">
                    Historique Global
                  </span>

                </div>

                <h1 className="text-5xl font-extrabold text-gray-800 leading-tight mb-3">
                  Historique Mensuel des Pointages
                </h1>

                <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
                  Consultez l'historique complet des présences,
                  absences, retards et congés du personnel
                  par période mensuelle.
                </p>

              </div>

            </div>

          </div>

          {/* ========================= */}
          {/* 🔥 PÉRIODE */}
          {/* ========================= */}
          <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">

            <div className="flex items-center gap-4 flex-wrap">

              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <FaCalendarAlt />
                <span>Période :</span>
              </div>

              {/* MOIS */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-100 px-5 py-3 rounded-xl outline-none border"
              >
                {months.map((m, index) => (
                  <option key={index} value={index}>
                    {m}
                  </option>
                ))}
              </select>

              {/* ANNÉE */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-gray-100 px-5 py-3 rounded-xl outline-none border"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>

            </div>

          </div>

          {/* ========================= */}
          {/* 🔥 CARDS */}
          {/* ========================= */}
          <div className="grid grid-cols-4 gap-6 mb-10">

            {/* PRÉSENCES */}
            <div className="bg-green-50 border border-green-200 rounded-3xl p-6 shadow-sm">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Présences
                  </p>

                  <h2 className="text-5xl font-bold text-green-600 mt-5">
                    {presences}
                  </h2>

                </div>

                <FaUserCheck className="text-4xl text-green-500" />

              </div>

            </div>

            {/* ABSENCES */}
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Absences
                  </p>

                  <h2 className="text-5xl font-bold text-red-500 mt-5">
                    {absences}
                  </h2>

                </div>

                <FaUserTimes className="text-4xl text-red-500" />

              </div>

            </div>

            {/* RETARDS */}
            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 shadow-sm">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Retards
                  </p>

                  <h2 className="text-5xl font-bold text-orange-500 mt-5">
                    {retards}
                  </h2>

                </div>

                <FaClock className="text-4xl text-orange-500" />

              </div>

            </div>

            {/* CONGÉS */}
            <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 shadow-sm">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Congés
                  </p>

                  <h2 className="text-5xl font-bold text-purple-600 mt-5">
                    {conges}
                  </h2>

                </div>

                <FaMugHot className="text-4xl text-purple-600" />

              </div>

            </div>

          </div>

          {/* ========================= */}
          {/* 🔥 TABLE */}
          {/* ========================= */}
          <div className="bg-white border rounded-3xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold mb-2">
              Détails des Pointages
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Historique complet pour {months[selectedMonth]} {selectedYear}
            </p>

            <div className="overflow-x-auto">

              <table className="w-full">

                {/* HEADER */}
                <thead>

                  <tr className="text-left text-gray-400 border-b">

                    <th className="pb-4">Date</th>
                    <th className="pb-4">Employé</th>
                    <th className="pb-4">Statut</th>
                    <th className="pb-4">Heure arrivée</th>
                    <th className="pb-4">Heure départ</th>

                  </tr>

                </thead>

                {/* BODY */}
                <tbody>

                  {monthlyPointages.map((p, i) => (

                    <tr
                      key={i}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {/* DATE */}
                      <td className="py-5">
                        {new Date(p.date).toLocaleDateString()}
                      </td>

                      {/* EMPLOYÉ */}
                      <td className="font-medium">
                        {p.firstName} {p.lastName}
                      </td>

                      {/* STATUT */}
                      <td>

                        {p.category === "absence" ? (

                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
                            Absent
                          </span>

                        ) : p.status === "En retard" ? (

                          <span className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-xs">
                            En retard
                          </span>

                        ) : (

                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                            Présent
                          </span>

                        )}

                      </td>

                      {/* ARRIVÉE */}
                      <td>
                        {p.arrival || "-"}
                      </td>

                      {/* DÉPART */}
                      <td>
                        {p.departure || "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* 🔥 SALAIRES */}
      {/* ================================================= */}
      {tab === "salary" && (

        <div className="bg-white rounded-3xl p-10 shadow-lg">

          <h1 className="text-4xl font-bold mb-3">
            Calcul des Salaires
          </h1>

          <p className="text-gray-500">
            Calcul automatique des salaires
            en fonction des pointages mensuels.
          </p>

        </div>
      )}

    </div>
  )
}

export default HistoriqueGlobal;