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
  FaArrowLeft,
  FaFilePdf,
  FaFileExcel,
  FaCheckCircle,
  FaTrash
} from "react-icons/fa"

function HistoriqueGlobal() {

  const navigate = useNavigate()

  // =========================
  // 🔥 ONGLET ACTIF
  // =========================
  const [tab, setTab] = useState("history")

  // =========================
  // 🔥 DONNÉES
  // =========================
  const [pointages, setPointages] = useState([])
  const [leaves, setLeaves] = useState([])

  // =========================
  // 🔥 FILTRES
  // =========================
  const currentDate = new Date()

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth()
  )

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  )

  // =========================
  // 🔥 PARAMÈTRES SALAIRES
  // =========================
  const [absenceDeduction, setAbsenceDeduction] = useState(100)
  const [retardDeduction, setRetardDeduction] = useState(10)
  const [hourSalary, setHourSalary] = useState(15)

  // 🔥 DEVISE
  const [currency, setCurrency] = useState("FCFA")

  // =========================
  // 🔥 API
  // =========================
  const API = "https://pointage-personnel.onrender.com/api"

  // =========================
  // 🔥 CHARGEMENT
  // =========================
  useEffect(() => {
    fetchData()
  }, [])

  // =========================
  // 🔥 FETCH
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
  
    // 🔥 NOM COMPLET
    const fullName = `
      ${p.firstName || ""}
      ${p.lastName || ""}
    `
    .trim()
    .replace(/\s+/g, " ")
  
    // 🔥 IGNORER LIGNES VIDES
    if (
      !fullName ||
      fullName === "undefined undefined"
    ) {
      return false
    }
  
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
  // 🔥 CALCULS
  // =========================
  const salaireBaseTotal = monthlyPointages.reduce((acc, p) => {

    const hours = parseFloat(p.hours) || 0

    return acc + (hours * hourSalary)

  }, 0)

  const deductionsTotal = monthlyPointages.reduce((acc, p) => {

    let deduction = 0

    if (p.category === "absence") {
      deduction += absenceDeduction
    }

    if (p.status === "En retard") {
      deduction += retardDeduction
    }

    return acc + deduction

  }, 0)

  const salaireNetTotal = Math.max(
    salaireBaseTotal - deductionsTotal,
    0
  )

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

// =========================
// 🔥 VALIDER SALAIRES
// =========================
  const handleValidateSalaries = async () => {

    try {
  
      const salairesData = Object.values(
        monthlyPointages.reduce((acc, p) => {
  
          const employeeKey = `${p.firstName} ${p.lastName}`
  
          if (!acc[employeeKey]) {
            acc[employeeKey] = {
              employe: employeeKey,
              mois: months[selectedMonth],
              annee: selectedYear,
              presences: 0,
              absences: 0,
              retards: 0,
              heures: 0
            }
          }
  
          if (
            p.status === "Présent" ||
            p.status === "En retard"
          ) {
            acc[employeeKey].presences += 1
          }
  
          if (p.category === "absence") {
            acc[employeeKey].absences += 1
          }
  
          if (p.status === "En retard") {
            acc[employeeKey].retards += 1
          }
  
          acc[employeeKey].heures +=
            parseFloat(p.hours) || 0
  
          return acc
  
        }, {})
      ).map((employee) => {
  
        const salaireBase =
          employee.heures * hourSalary
  
        const deductions =
          (employee.absences * absenceDeduction) +
          (employee.retards * retardDeduction)
  
        const salaireNet =
          salaireBase - deductions
  
        return {
          ...employee,
          tauxHoraire: hourSalary,
          salaireBase,
          deductions,
          salaireNet,
          devise: currency
        }
      })
  
      await axios.post(
        `${API}/salaires`,
        salairesData
      )
  
      alert("✅ Salaires validés avec succès")
  
    } catch (err) {

      console.log(err)
    
      alert(
        err.response?.data?.message ||
        "❌ Erreur lors de la validation"
      )
    }
  }  

// =========================
// 🔥 SUPPRIMER SALAIRES
// =========================
  const handleDeleteSalary = async (employeeName) => {

    if (
      !employeeName ||
      employeeName === "undefined undefined"
    ) {
      alert("❌ Employé invalide")
      return
    }

    const confirmDelete = window.confirm(
      `Supprimer les informations salariales de ${employeeName} ?`
    )
  
    if (!confirmDelete) return
  
    try {
  
      await axios.delete(
        `${API}/salaires/${employeeName}`
      )
  
      alert("✅ Salaire supprimé avec succès")
  
      fetchData()
  
    } catch (err) {
  
      console.log(err)
  
      alert("❌ Erreur suppression")
  
    }
  }

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

        {/* RETOUR */}
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
            transition-all
            duration-300
            font-semibold
          "
        >
          <FaArrowLeft />
          Retour Accueil
        </button>

        {/* ONGLETS */}
        <div className="flex gap-3">

        <button
           onClick={() =>
           navigate("/historique-paiements")
          }
            className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded-2xl
            hover:scale-105
            transition
            flex
            items-center
            gap-2
            "
          >
        <FaCalendarAlt />
       Historique Paiements
        </button>

          <button
            onClick={() => setTab("history")}
            className={`px-5 py-3 rounded-2xl text-sm flex items-center gap-2 transition ${
              tab === "history"
                ? "bg-black text-white"
                : "bg-white border"
            }`}
          >
            <FaCalendarAlt />
            Historique Mensuel
          </button>

          <button
            onClick={() => setTab("salary")}
            className={`px-5 py-3 rounded-2xl text-sm flex items-center gap-2 transition ${
              tab === "salary"
                ? "bg-black text-white"
                : "bg-white border"
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

          {/* HERO */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-10">

            <div className="flex items-center gap-4 mb-4">

              <div className="bg-orange-500 text-white p-4 rounded-2xl">
                <FaCalendarAlt className="text-2xl" />
              </div>

              <div>
                <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold">
                  Historique Global
                </span>

                <h1 className="text-5xl font-extrabold text-gray-800 mt-3">
                  Historique Mensuel des Pointages
                </h1>
              </div>

            </div>

            <p className="text-gray-600 text-lg">
              Consultez l'historique complet des présences,
              absences, retards et congés du personnel.
            </p>

          </div>

          {/* PÉRIODE */}
          <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">

            <div className="flex items-center gap-4 flex-wrap">

              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <FaCalendarAlt />
                <span>Période :</span>
              </div>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-100 px-5 py-3 rounded-xl border"
              >
                {months.map((m, index) => (
                  <option key={index} value={index}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-gray-100 px-5 py-3 rounded-xl border"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>

            </div>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-6 mb-10">

            <div className="bg-green-50 border border-green-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Présences</p>
                  <h2 className="text-5xl font-bold text-green-600 mt-5">
                    {presences}
                  </h2>
                </div>
                <FaUserCheck className="text-4xl text-green-500" />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Absences</p>
                  <h2 className="text-5xl font-bold text-red-500 mt-5">
                    {absences}
                  </h2>
                </div>
                <FaUserTimes className="text-4xl text-red-500" />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Retards</p>
                  <h2 className="text-5xl font-bold text-orange-500 mt-5">
                    {retards}
                  </h2>
                </div>
                <FaClock className="text-4xl text-orange-500" />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Congés</p>
                  <h2 className="text-5xl font-bold text-purple-600 mt-5">
                    {conges}
                  </h2>
                </div>
                <FaMugHot className="text-4xl text-purple-600" />
              </div>
            </div>

          </div>

   {/* 🔥 TABLE */}
   <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">
              Détails des Pointages
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Historique complet pour {months[selectedMonth]} {selectedYear}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b">
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Employé</th>
                    <th className="pb-4">Statut</th>
                    <th className="pb-4">Heure arrivée</th>
                    <th className="pb-4">Heure départ</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyPointages.map((p, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-5">
                        {new Date(p.date).toLocaleDateString()}
                      </td>
                      <td className="font-medium">
                        {p.firstName} {p.lastName}
                      </td>
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
                      <td>{p.arrival || "-"}</td>
                      <td>{p.departure || "-"}</td>
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

        <div>

          {/* HERO */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-10">

            <div className="flex items-center gap-4 mb-4">

              <div className="bg-green-600 text-white p-4 rounded-2xl">
                <FaDollarSign className="text-2xl" />
              </div>

              <div>
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                  Gestion Salariale
                </span>

                <h1 className="text-5xl font-extrabold text-gray-800 mt-3">
                  Calcul Automatique des Salaires
                </h1>
              </div>

            </div>

            <p className="text-gray-600 text-lg">
              Consultez les heures travaillées et les salaires mensuels.
            </p>

          </div>

          {/* PARAMÈTRES */}
          <div className="grid grid-cols-2 gap-6 mb-8">

            {/* PÉRIODE */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border">

              <div className="flex items-center gap-3 mb-6">
                <FaCalendarAlt />
                <h2 className="font-bold text-lg">
                  Période de calcul
                </h2>
              </div>

              <div className="flex gap-4">

                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-gray-100 px-5 py-3 rounded-xl border"
                >
                  {months.map((m, index) => (
                    <option key={index} value={index}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-gray-100 px-5 py-3 rounded-xl border"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>

              </div>

            </div>

            {/* PARAMÈTRES */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border">

              <h2 className="font-bold text-lg mb-6">
                Paramètres de déduction
              </h2>

              <div className="grid grid-cols-4 gap-4">

                {/* ABSENCE */}
                <div>
                  <label className="text-sm text-gray-500">
                    Déduction absence
                  </label>

                  <input
                    type="number"
                    value={absenceDeduction}
                    onChange={(e) =>
                      setAbsenceDeduction(Number(e.target.value))
                    }
                    className="w-full mt-2 bg-gray-100 p-3 rounded-xl border"
                  />
                </div>

                {/* RETARD */}
                <div>
                  <label className="text-sm text-gray-500">
                    Déduction retard
                  </label>

                  <input
                    type="number"
                    value={retardDeduction}
                    onChange={(e) =>
                      setRetardDeduction(Number(e.target.value))
                    }
                    className="w-full mt-2 bg-gray-100 p-3 rounded-xl border"
                  />
                </div>

                {/* SALAIRE HEURE */}
                <div>
                  <label className="text-sm text-gray-500">
                    Salaire / heure
                  </label>

                  <input
                    type="number"
                    value={hourSalary}
                    onChange={(e) =>
                      setHourSalary(Number(e.target.value))
                    }
                    className="w-full mt-2 bg-gray-100 p-3 rounded-xl border"
                  />
                </div>

                {/* DEVISE */}
                <div>

                  <label className="text-sm text-gray-500">
                    Devise
                  </label>

                  <select
                    value={currency}
                    onChange={(e) =>
                      setCurrency(e.target.value)
                    }
                    className="
                      w-full
                      mt-2
                      bg-gray-100
                      p-3
                      rounded-xl
                      border
                    "
                  >
                    <option value="FCFA">FCFA</option>
                    <option value="€">€ Euro</option>
                    <option value="$">$ Dollar</option>
                    <option value="£">£ Livre</option>
                  </select>

                </div>

              </div>

            </div>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-3xl p-6 shadow-lg border">
              <p className="text-gray-500 mb-4">
                Salaire de base total
              </p>

              <h2 className="text-4xl font-bold text-green-600">
                {salaireBaseTotal.toFixed(2)} {currency}
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border">
              <p className="text-gray-500 mb-4">
                Déductions totales
              </p>

              <h2 className="text-4xl font-bold text-red-500">
                {deductionsTotal.toFixed(2)} {currency}
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border">
              <p className="text-gray-500 mb-4">
                Salaire net total
              </p>

              <h2 className="text-4xl font-bold text-blue-600">
                {salaireNetTotal.toFixed(2)} {currency}
              </h2>
            </div>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border mb-8">

            <h2 className="text-2xl font-bold mb-2">
              Détails par Employé
            </h2>

            <p className="text-gray-400 mb-8">
              Calcul détaillé pour {months[selectedMonth]} {selectedYear}
            </p>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="text-left text-gray-400 border-b">

                    <th className="pb-4">Employé</th>
                    <th className="pb-4">Poste</th>
                    <th className="pb-4">Taux horaire</th>
                    <th className="pb-4">Présences</th>
                    <th className="pb-4">Absences</th>
                    <th className="pb-4">Retards</th>
                    <th className="pb-4">Heures</th>
                    <th className="pb-4">Salaire base</th>
                    <th className="pb-4">Déductions</th>
                    <th className="pb-4">Salaire net</th>
                    <th className="pb-4 text-center">
                        Action
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {Object.values(

monthlyPointages.reduce((acc, p) => {

  // 🔥 NOM COMPLET PROPRE
  const fullName = `
    ${p.firstName || ""}
    ${p.lastName || ""}
  `
  .trim()
  .replace(/\s+/g, " ")

  // 🔥 IGNORER EMPLOYÉS INVALIDES
  if (
    !fullName ||
    fullName === "undefined undefined"
  ) {
    return acc
  }

  // 🔥 CLÉ UNIQUE
  const employeeKey = fullName
    .toLowerCase()

  // 🔥 CRÉATION EMPLOYÉ
  if (!acc[employeeKey]) {

    acc[employeeKey] = {
      employee: fullName,
      presences: 0,
      absences: 0,
      retards: 0,
      heures: 0
    }
  }

  // 🔥 PRÉSENCES
  if (
    p.status === "Présent" ||
    p.status === "En retard"
  ) {
    acc[employeeKey].presences += 1
  }

  // 🔥 ABSENCES
  if (p.category === "absence") {
    acc[employeeKey].absences += 1
  }

  // 🔥 RETARDS
  if (p.status === "En retard") {
    acc[employeeKey].retards += 1
  }

  // 🔥 HEURES
  acc[employeeKey].heures +=
    parseFloat(p.hours) || 0

  return acc

}, {})

                  ).map((employee, i) => {

                    const tauxHoraire = hourSalary

                    const salaireBase =
                      employee.heures * tauxHoraire

                    const deductions =
                      (employee.absences * absenceDeduction) +
                      (employee.retards * retardDeduction)

                    const salaireNet =
                      salaireBase - deductions

                    return (

                      <tr
                        key={i}
                        className="border-b hover:bg-gray-50 transition"
                      >

                        {/* EMPLOYÉ */}
                        <td className="py-5 font-semibold">
                          {employee.employee}
                        </td>

                        {/* POSTE */}
                        <td>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                            Employé
                          </span>
                        </td>

                        {/* TAUX */}
                        <td>
                          {tauxHoraire} {currency}/h
                        </td>

                        {/* PRÉSENCES */}
                        <td>
                          <span className="bg-black text-white px-3 py-1 rounded-full text-xs">
                            {employee.presences}
                          </span>
                        </td>

                        {/* ABSENCES */}
                        <td>
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                            {employee.absences}
                          </span>
                        </td>

                        {/* RETARDS */}
                        <td>
                          <span className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs">
                            {employee.retards}
                          </span>
                        </td>

                        {/* HEURES */}
                        <td>
                          {employee.heures.toFixed(2)}h
                        </td>

                        {/* SALAIRE BASE */}
                        <td>
                          {salaireBase.toFixed(2)} {currency}
                        </td>

                        {/* DÉDUCTIONS */}
                        <td className="text-red-500">
                          -{deductions.toFixed(2)} {currency}
                        </td>

                        {/* SALAIRE NET */}
                        <td className="font-bold text-green-600">
                          {salaireNet.toFixed(2)} {currency}
                        </td>

                        {/* ACTION */}
                        <td className="text-center">

                        {employee.employee &&
                        employee.employee !== "undefined undefined" && (

                     <button
                       onClick={() =>
                        handleDeleteSalary(employee.employee)
                      }
                     className="
                      bg-red-100
                      hover:bg-red-500
                      text-red-500
                      hover:text-white
                      p-3
                      rounded-xl
                      transition
                      duration-300
                      "
                    >
                      <FaTrash />
                    </button>
                    )}
                       </td>
                      </tr>

                    )

                  })}

                </tbody>

              </table>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border">

            <h2 className="font-bold text-xl mb-6">
              Actions
            </h2>

            <div className="flex gap-4 flex-wrap">

            <button
              onClick={handleValidateSalaries}
              className="bg-black text-white px-6 py-3 rounded-2xl hover:scale-105 transition flex items-center gap-2"
            >
                <FaCheckCircle />
               Valider les salaires
            </button>

              <button className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition flex items-center gap-2">
                <FaFilePdf />
                Exporter PDF
              </button>

              <button className="bg-green-600 text-white px-6 py-3 rounded-2xl hover:scale-105 transition flex items-center gap-2">
                <FaFileExcel />
                Exporter Excel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default HistoriqueGlobal