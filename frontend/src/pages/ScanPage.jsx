import { useState } from "react"
import axios from "axios"

function ScanPage() {

  const [matricule, setMatricule] = useState("")
  const [message, setMessage] = useState("")
  const [hasArrived, setHasArrived] = useState(false)

  const handleScan = async () => {

    try {

      const res = await axios.post(
        "https://pointage-personnel.onrender.com/api/pointages/scan",
        hasArrived ? {} : { matricule } // ✅ magie ici
      )

      setMessage(res.data.message)

      if (res.data.type === "arrival") {
        setHasArrived(true) // cache input après
      }

    } catch (err) {
      console.log(err)
      setMessage("❌ Erreur serveur")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">

      <div className="bg-white p-6 rounded-2xl shadow w-[320px]">

        <h2 className="text-lg font-semibold mb-4 text-center">
          📲 Pointage employé
        </h2>

        {/* 🔥 INPUT UNIQUEMENT AVANT ARRIVÉE */}
        {!hasArrived && (
          <input
            type="text"
            placeholder="Matricule employé"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            className="w-full p-3 border rounded mb-4"
          />
        )}

        <button
          onClick={handleScan}
          className="w-full bg-green-500 text-white p-3 rounded font-semibold"
        >
          Pointer
        </button>

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