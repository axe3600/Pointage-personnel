import { useState } from "react"

function RightPanel({ leaves, pointages, deleteLeave }) {

  const [tab, setTab] = useState("today")

  const today = new Date()

  // 🔹 Formatter date string (même format que ton app)
  const formatDate = (date) =>
    new Date(date).toLocaleDateString()

  const todayString = formatDate(today)

  // 🔥 FONCTION : vérifier si date <= 7 jours
// 🔥 Convertir "dd/mm/yyyy" → vrai Date
const parseFRDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/")
  return new Date(year, month - 1, day)
}

// 🔥 Vérifie si dans les 7 derniers jours
const isWithin7Days = (dateStr) => {
  const itemDate = parseFRDate(dateStr)

  const today = new Date()
  const diff = (today - itemDate) / (1000 * 60 * 60 * 24)

  return diff >= 0 && diff <= 7
}

  // =========================
  // 🔥 DATA DU JOUR
  // =========================
  const todayData = [
    ...leaves.map(l => ({ ...l, category: "leave" })),
    ...pointages
  ].filter(item => item.date === todayString)

  // =========================
  // 🔥 HISTORIQUE (7 JOURS)
  // =========================
  const historyData = [
    ...leaves.map(l => ({ ...l, category: "leave" })),
    ...pointages
  ].filter(item => isWithin7Days(item.date))

  // =========================
  // 🔥 BADGE CENTRALISÉ  (IMPORTANT 🔥)
  // =========================
  const getBadge = (item) => {

    // CONGÉ
    if (item.category === "leave") {
      return { label: "Congé", style: "bg-purple-100 text-purple-600" }
    }

    // ABSENCE
    if (item.category === "absence") {
      return { label: "Absent", style: "bg-red-100 text-red-600" }
    }

    // RETARD
    if (item.status === "En retard") {
      return { label: "En retard", style: "bg-orange-100 text-orange-500" }
    }

    // PRÉSENT
    return { label: "Présent", style: "bg-green-100 text-green-600" }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-full">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Activités
        </h2>

        {/* 🔥 TABS */}
        <div className="flex bg-gray-100 rounded-xl p-1">

          <button
            onClick={() => setTab("today")}
            className={`px-4 py-2 text-sm rounded-lg ${
              tab === "today" ? "bg-white shadow" : "text-gray-500"
            }`}
          >
            Aujourd'hui
          </button>

          <button
            onClick={() => setTab("history")}
            className={`px-4 py-2 text-sm rounded-lg ${
              tab === "history" ? "bg-white shadow" : "text-gray-500"
            }`}
          >
            Historique (7 jours)
          </button>

          <button
            onClick={() => setTab("leave")}
            className={`px-4 py-2 text-sm rounded-lg ${
              tab === "leave" ? "bg-white shadow" : "text-gray-500"
            }`}
          >
            Congés
          </button>

        </div>
      </div>

      {/* 🔥 TABLE HEADER (pas pour congés) */}
      {tab !== "leave" && (
        <div className="grid grid-cols-7 text-sm text-gray-400 px-4 pb-2 border-b">
          <span>Date</span>
          <span>Employé</span>
          <span>Arrivée</span>
          <span>Départ</span>
          <span>Heures</span>
          <span>Statut</span>
          <span>Notes</span>
        </div>
      )}

      {/* 🔥 CONTENT */}
      <div className="mt-3 space-y-2">

        {/* ===================== */}
        {/* 🔥 AUJOURD’HUI */}
        {/* ===================== */}
        {tab === "today" && (
          todayData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Aucune activité aujourd'hui
            </div>
          ) : (
            todayData.map((item, i) => {
              const badge = getBadge(item)

              return (
                <div key={i} className="grid grid-cols-7 items-center px-4 py-3 rounded-xl hover:bg-gray-50">

                  <span className="text-sm text-gray-600">{item.date}</span>

                  <span className="font-medium text-gray-800">
                    {item.firstName} {item.lastName}
                  </span>

                  <span>{item.arrival || "-"}</span>
                  <span>{item.departure || "-"}</span>
                  <span>{item.hours || "-"}</span>

                  {/* 🔥 BADGE */}
                  <span>
                    <span className={`px-3 py-1 text-xs rounded-full ${badge.style}`}>
                      {badge.label}
                    </span>
                  </span>

                  <span className="text-gray-500 text-sm">
                    {item.reason || "-"}
                  </span>

                </div>
              )
            })
          )
        )}

        {/* ===================== */}
        {/* 🔥 HISTORIQUE (AUTO 7 JOURS) */}
        {/* ===================== */}
        {tab === "history" && (
          historyData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Aucun historique récent
            </div>
          ) : (
            historyData.map((item, i) => {

              const badge = getBadge(item)

              return (
                <div key={i} className="grid grid-cols-7 items-center px-4 py-3 rounded-xl border hover:bg-gray-50">

                  <span>{item.date}</span>

                  <span className="font-medium">
                    {item.firstName} {item.lastName}
                  </span>

                  <span>{item.arrival || "-"}</span>
                  <span>{item.departure || "-"}</span>
                  <span>{item.hours || "-"}</span>

                  <span>
                    <span className={`px-3 py-1 text-xs rounded-full ${badge.style}`}>
                      {badge.label}
                    </span>
                  </span>

                  <span className="text-gray-500 text-sm">
                    {item.reason || "-"}
                  </span>

                </div>
              )
            })
          )
        )}

        {/* ===================== */}
        {/* 🔥 CONGÉS */}
        {/* ===================== */}
        {tab === "leave" && (
          leaves.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Aucun congé
            </div>
          ) : (
            <div className="space-y-4">

              {leaves.map((l, i) => (
                <div key={i} className="bg-gray-50 border rounded-2xl p-5 hover:shadow">

                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-2">

                    <div className="flex items-center gap-3">

                      {/* TYPE */}
                      <span className="bg-gray-200 px-3 py-1 text-xs rounded-full">
                        {l.type}
                      </span>

                      {/* STATUS */}
                      <span className="border border-orange-400 text-orange-500 px-3 py-1 text-xs rounded-full">
                        En attente
                      </span>

                      {/* ❌ delete gardé seulement pour congé */}
                      <button
                        onClick={() => deleteLeave(i)}
                        className="text-red-400 hover:text-red-600"
                      >
                        🗑️
                      </button>

                    </div>

                    {/* DURÉE */}
                    <span className="font-semibold">
                      {l.startDate && l.endDate
                        ? `${Math.ceil(
                            (new Date(l.endDate) - new Date(l.startDate)) /
                            (1000 * 60 * 60 * 24)
                          ) + 1} jours`
                        : ""}
                    </span>

                  </div>

                  {/* DATE */}
                  <p className="text-sm text-gray-400 mb-2">
                    Demandé le {l.date}
                  </p>

                  {/* PÉRIODE */}
                  <p className="text-sm mb-3">
                    📅 Du {l.startDate} au {l.endDate}
                  </p>

                  {/* MOTIF */}
                  <div className="bg-white border rounded-lg p-3 text-sm">
                    <span className="text-gray-400">Motif :</span>
                    <p>{l.reason || "Aucun motif"}</p>
                  </div>

                </div>
              ))}

            </div>
          )
        )}

      </div>
    </div>
  )
}

export default RightPanel;