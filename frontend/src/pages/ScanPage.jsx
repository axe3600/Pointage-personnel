import { useState } from "react"
import axios from "axios"

function ScanPage() {

  // ✅ matricule au lieu du nom
  const [matricule, setMatricule] = useState("")
  const [message, setMessage] = useState("")

  const handleScan = async () => {

    if (!matricule) {
      return alert("Entre ton matricule")
    }

    try {

      // 🔥 IMPORTANT : utiliser URL BACKEND (Render)
      const res = await axios.post(
        "https://pointage-personnel.onrender.com/api/pointages/scan",
        { matricule }
      )

      // ✅ message dynamique (arrivée ou départ)
      setMessage(res.data.message)

    } catch (err) {
      console.log("Erreur scan :", err)
      setMessage("❌ Erreur serveur")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">

      <div className="bg-white p-6 rounded-2xl shadow-lg w-[320px]">

        <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
          📲 Pointage employé
        </h2>

        {/* 🔥 INPUT MATRICULE */}
        <input
          type="text"
          placeholder="Matricule employé"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        {/* 🔥 UN SEUL BOUTON */}
        <button
          onClick={handleScan}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg font-semibold transition"
        >
          Pointer
        </button>

        {/* 🔥 MESSAGE */}
        {message && (
          <p className="text-center mt-4 text-sm text-green-600 font-medium">
            {message}
          </p>
        )}

      </div>
    </div>
  )
}

export default ScanPage