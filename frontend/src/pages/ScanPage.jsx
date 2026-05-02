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

      const res = await axios.post(
        "http://localhost:5000/api/pointages/scan",
        { matricule }
      )

      // ✅ message dynamique (arrivée ou départ)
      setMessage(res.data.message)

    } catch (err) {
      console.log(err)
      setMessage("❌ Erreur serveur")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">

      <div className="bg-white p-6 rounded-2xl shadow w-[320px]">

        <h2 className="text-lg font-semibold mb-4 text-center">
          Pointage employé
        </h2>

        {/* 🔥 INPUT MATRICULE */}
        <input
          type="text"
          placeholder="Matricule employé"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        {/* 🔥 UN SEUL BOUTON */}
        <button
          onClick={handleScan}
          className="w-full bg-green-500 text-white p-3 rounded font-semibold"
        >
          Pointer
        </button>

        {/* 🔥 MESSAGE */}
        {message && (
          <p className="text-center mt-4 text-sm text-green-600">
            {message}
          </p>
        )}

      </div>
    </div>
  )
}

export default ScanPage;