
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

  const [leaves, setLeaves] = useState([])
  const [pointages, setPointages] = useState([])

  // 🔥 FETCH POINTAGES
  const fetchPointages = async () => {
    try {
      const res = await axios.get("https://pointage-personnel.onrender.com/api/pointages")
      setPointages(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // 🔥 FETCH LEAVES
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("https://pointage-personnel.onrender.com/api/leaves")
      setLeaves(res.data)
    } catch (err) {
      console.log("Erreur leaves")
    }
  }

  // =========================
  // 🔄 LOAD + REFRESH AUTO
  // =========================
  useEffect(() => {
    fetchPointages()
    fetchLeaves()

    const interval = setInterval(() => {
      fetchPointages()
      fetchLeaves()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!isAuth) return <LoginModal onLogin={() => setIsAuth(true)} />

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">

      <Navbar refreshData={() => {
        fetchLeaves()
      }} />

      <div className="flex-grow">

        <StatsCards leaves={leaves} pointages={pointages} />

        <div className="max-w-[1400px] mx-auto px-6 mt-6 grid grid-cols-12 gap-8">

          <div className="col-span-4">
            <LeftPanel refreshData={fetchPointages} />
          </div>

          <div className="col-span-8">
            <RightPanel
              leaves={leaves}
              pointages={pointages}
            />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard