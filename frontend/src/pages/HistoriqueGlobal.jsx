import { useState } from "react"
import {
  FaCalendarAlt,
  FaDollarSign,
  FaUserCheck,
  FaUserTimes,
  FaClock
} from "react-icons/fa"

function HistoriqueGlobal() {

  const [tab, setTab] = useState("history")

  return (
    <div className="min-h-screen bg-gray-100 p-5">

      {/* TOP BUTTONS */}
      <div className="flex gap-2 mb-6">

        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${
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
          className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${
            tab === "salary"
              ? "bg-black text-white"
              : "bg-white border"
          }`}
        >
          <FaDollarSign />
          Calcul des Salaires
        </button>

      </div>

      {/* ========================= */}
      {/* 🔥 HISTORIQUE */}
      {/* ========================= */}
      {tab === "history" && (

        <div>

          <h1 className="text-3xl font-bold mb-2">
            Historique Mensuel des Pointages
          </h1>

          <p className="text-gray-500 mb-8">
            Consultez l'historique complet des présences
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-4 gap-4 mb-8">

            <div className="bg-white p-6 rounded-2xl border">
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <FaUserCheck />
                <span>Présences</span>
              </div>

              <h2 className="text-4xl font-bold">83</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl border">
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <FaUserTimes />
                <span>Absences</span>
              </div>

              <h2 className="text-4xl font-bold">12</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl border">
              <div className="flex items-center gap-2 text-orange-500 mb-3">
                <FaClock />
                <span>Retards</span>
              </div>

              <h2 className="text-4xl font-bold">8</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl border">
              <div className="flex items-center gap-2 text-blue-600 mb-3">
                <FaClock />
                <span>Partiels</span>
              </div>

              <h2 className="text-4xl font-bold">2</h2>
            </div>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl border p-6">

            <h2 className="font-semibold mb-5">
              Détails des Pointages
            </h2>

            <table className="w-full">

              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Employé</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3">Heure arrivée</th>
                  <th className="pb-3">Heure départ</th>
                </tr>
              </thead>

              <tbody>

                <tr className="border-b">
                  <td className="py-4">07 Mai 2026</td>
                  <td>Koukougnon Axel</td>
                  <td>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                      Présent
                    </span>
                  </td>
                  <td>08:00</td>
                  <td>17:00</td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* 🔥 SALAIRES */}
      {/* ========================= */}
      {tab === "salary" && (

        <div>

          <h1 className="text-3xl font-bold mb-2">
            Calcul des Salaires
          </h1>

          <p className="text-gray-500 mb-8">
            Calcul automatique des salaires
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">

            <div className="bg-white p-6 rounded-2xl border">
              <p className="text-gray-500 mb-2">
                Salaire de base total
              </p>

              <h2 className="text-4xl font-bold">
                11124 €
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl border">
              <p className="text-gray-500 mb-2">
                Déductions
              </p>

              <h2 className="text-4xl font-bold text-red-500">
                1445 €
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl border">
              <p className="text-gray-500 mb-2">
                Salaire net
              </p>

              <h2 className="text-4xl font-bold text-green-600">
                9678 €
              </h2>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default HistoriqueGlobal;