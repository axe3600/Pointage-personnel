import { useState } from "react"
import { FaClipboardList } from "react-icons/fa"
import LeaveModal from "../ui/LeaveModal"

function Navbar({ addLeave }) {

  // 🔥 Gestion ouverture popup
  const [open, setOpen] = useState(false)

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

          {/* 🔹 Bouton ouverture modal */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition font-medium"
          >
            <span className="text-lg">+</span>
            <span>Demander un congé</span>
          </button>

        </div>
      </div>

      {/* 🔥 Modal reçoit la fonction addLeave */}
      <LeaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={addLeave}
      />
    </>
  )
}

export default Navbar;