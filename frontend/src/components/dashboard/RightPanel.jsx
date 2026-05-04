import { useState } from "react"

function RightPanel({ leaves, pointages, deleteLeave }) {

  const [tab, setTab] = useState("today")

  const today = new Date()

  // 🔥 NORMALISATION DATE
  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr)
    if (!isNaN(d)) return d.toDateString()

    const parts = dateStr.split("/")
    if (parts.length === 3) {
      const [day, month, year] = parts
      return new Date(year, month - 1, day).toDateString()
    }

    return ""
  }

  const isSameDay = (d1, d2) => {
    return normalizeDate(d1) === new Date(d2).toDateString()
  }

  const isWithin7Days = (dateStr) => {
    const parsed = normalizeDate(dateStr)
    const itemDate = new Date(parsed)

    const diff = (today - itemDate) / (1000 * 60 * 60 * 24)

    return diff >= 0 && diff <= 7
  }

  // ✅ UNIQUEMENT POINTAGES (FIX MAJEUR)
  const todayData = pointages.filter(item =>
    isSameDay(item.date, today)
  )

  const historyData = pointages.filter(item =>
    isWithin7Days(item.date)
  )

  // 🔥 BADGE
  const getBadge = (item) => {

    if (item.category === "absence") {
      return { label: "Absent", style: "bg-red-100 text-red-600" }
    }

    if (item.status === "En retard") {
      return { label: "En retard", style: "bg-orange-100 text-orange-500" }
    }

    return { label: "Présent", style: "bg-green-100 text-green-600" }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-full">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Activités
        </h2>

        <div className="flex bg-gray-100 rounded-xl p-1">

          <button onClick={() => setTab("today")}
            className={`px-4 py-2 text-sm rounded-lg ${tab === "today" ? "bg-white shadow" : "text-gray-500"}`}>
            Aujourd'hui
          </button>

          <button onClick={() => setTab("history")}
            className={`px-4 py-2 text-sm rounded-lg ${tab === "history" ? "bg-white shadow" : "text-gray-500"}`}>
            Historique (7 jours)
          </button>

          <button onClick={() => setTab("leave")}
            className={`px-4 py-2 text-sm rounded-lg ${tab === "leave" ? "bg-white shadow" : "text-gray-500"}`}>
            Congés
          </button>

        </div>
      </div>

      {/* TABLE */}
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

      <div className="mt-3 space-y-2">

        {/* 🔥 AUJOURD’HUI */}
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

                  <span>{item.date}</span>
                  <span className="font-medium">{item.firstName} {item.lastName}</span>
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

        {/* 🔥 HISTORIQUE */}
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
                  <span className="font-medium">{item.firstName} {item.lastName}</span>
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

        {/* 🔥 CONGÉS (LOCAL POUR L’INSTANT) */}
        {tab === "leave" && (
          leaves.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Aucun congé
            </div>
          ) : (
            <div className="space-y-4">

              {leaves.map((l, i) => (
                <div key={i} className="bg-gray-50 border rounded-2xl p-5">

                  <div className="flex justify-between items-center mb-2">

                    <span className="bg-gray-200 px-3 py-1 text-xs rounded-full">
                      {l.type}
                    </span>

                    <button
                      onClick={() => deleteLeave(i)}
                      className="text-red-400"
                    >
                      🗑️
                    </button>

                  </div>

                  <p className="text-sm text-gray-400 mb-2">
                    Demandé le {l.date}
                  </p>

                  <p className="text-sm">
                    📅 Du {l.startDate} au {l.endDate}
                  </p>

                </div>
              ))}

            </div>
          )
        )}

      </div>
    </div>
  )
}

export default RightPanel