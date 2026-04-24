import { FaUsers, FaUserCheck, FaUserTimes, FaClock, FaMugHot } from "react-icons/fa"
import { useState, useEffect } from "react"

function StatsCards({ leaves, pointages }) {

  const today = new Date().toLocaleDateString()

  // 🔥 Total employés (admin)
  const [totalEmployees, setTotalEmployees] = useState(() => {
    return Number(localStorage.getItem("totalEmployees")) || 0
  })

  useEffect(() => {
    localStorage.setItem("totalEmployees", totalEmployees)
  }, [totalEmployees])

  // 🔥 DATA DU JOUR
  const todayPointages = pointages.filter(p => p.date === today)

  // ✅ CALCULS CORRECTS
  const presents = todayPointages.filter(p => p.status === "Présent").length

  const retard = todayPointages.filter(p => p.status === "En retard").length

  const absents = todayPointages.filter(p => p.category === "absence").length

  const enConge = leaves.filter(l => l.date === today).length

  // 🔥 CARD
  function Card({ title, value, icon, color }) {
    const styles = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      red: "bg-red-50 border-red-200 text-red-600",
      orange: "bg-orange-50 border-orange-200 text-orange-500",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
    }

    return (
      <div className={`border rounded-xl p-4 flex justify-between items-center ${styles[color]}`}>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        {icon}
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 mt-6">

      <h2 className="text-gray-700 font-semibold mb-4">
        👥 Vue d'ensemble du jour
      </h2>

      {/* INPUT ADMIN */}
      <input
        type="number"
        placeholder="Total employés"
        value={totalEmployees}
        onChange={(e) => setTotalEmployees(Number(e.target.value))}
        className="mb-4 p-2 border rounded"
      />

      <div className="grid grid-cols-5 gap-4">

        <Card title="Total Employés" value={totalEmployees} icon={<FaUsers />} color="blue" />
        <Card title="Présents" value={presents} icon={<FaUserCheck />} color="green" />
        <Card title="Absents" value={absents} icon={<FaUserTimes />} color="red" />
        <Card title="En retard" value={retard} icon={<FaClock />} color="orange" />
        <Card title="En congé" value={enConge} icon={<FaMugHot />} color="purple" />

      </div>
    </div>
  )
}

export default StatsCards;