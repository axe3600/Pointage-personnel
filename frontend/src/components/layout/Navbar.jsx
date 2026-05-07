import { useState } from "react"
import { FaClipboardList, FaUserPlus } from "react-icons/fa"
import LeaveModal from "../ui/LeaveModal"
import { useNavigate } from "react-router-dom"

function Navbar({ addLeave }) {

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

    return (
    <>
      <div className="w-full bg-white py-5 border-b border-gray-100">
        
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

          {/* 🔹 Logo + titre */}
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-3 rounded-xl">
              <FaClipboardList />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Pointage Personnel
              </h1>
              <p className="text-sm text-gray-500">
                Système de gestion des présences
              </p>
            </div>
          </div>

          {/* 🔹 Ajouter employé */}
          <button
            onClick={() => navigate("/Enregistrement-Employe")}
            className="bg-indigo-500 text-white p-4 rounded-lg hover:bg-indigo-600 transition"
          >
            <FaUserPlus />
          </button>

          {/* 🔹 Demande congé */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition font-medium"
          >
            <span className="text-lg">+</span>
            <span>Demander un congé</span>
          </button>

        </div>
      </div>

      {/* 🔥 Modal connecté à MongoDB */}
      <LeaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={addLeave} // 🔥 reload API
      />
    </>
  )
}

export default Navbar