import { useState, useEffect } from "react"
import axios from "axios"

function ScanPage() {

  const [matricule, setMatricule] = useState("")
  const [message, setMessage] = useState("")
  const [isDeparture, setIsDeparture] = useState(false)

  // 🔥 CHECK AUTO (départ)
  useEffect(() => {
    const checkDeparture = async () => {
      try {
        const res = await axios.post(
          "https://pointage-personnel.onrender.com/api/pointages/scan",
          {}
        )

        if (res.data.type === "departure") {
          setIsDeparture(true)
          setMessage(`👋 Départ enregistré à ${res.data.data.departure}`)

          // 🔥 fermeture auto après 2s
          setTimeout(() => {
            window.close()
          }, 2000)
        }

      } catch (err) {}
    }

    checkDeparture()
  }, [])

  // 🔥 ARRIVÉE
  const handleArrival = async () => {

    if (!matricule) {
      return alert("Entre ton matricule")
    }

    try {
      const res = await axios.post(
        "https://pointage-personnel.onrender.com/api/pointages/scan",
        { matricule }
      )

      // ✅ afficher heure
      ssetMessage(`✅ Arrivé à ${res.data.data.arrival}`)

      // 🔥 fermeture auto après 2s
      setTimeout(() => {
        window.close()
      }, 2000)

    } catch (err) {
      setMessage("❌ Erreur serveur")
    }
  }

// 🔥 envoyer event au dashboard
window.localStorage.setItem("refresh", Date.now())

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">

      <div className="bg-white p-6 rounded-2xl shadow w-[320px]">

        <h2 className="text-lg font-semibold mb-4 text-center">
          📲 Pointage personnel
        </h2>

        {isDeparture ? (
          <p className="text-center text-green-600 font-semibold">
            {message}
          </p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Matricule employé"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="w-full p-3 border rounded mb-4"
            />

            <button
              onClick={handleArrival}
              className="w-full bg-green-500 text-white p-3 rounded font-semibold"
            >
              Pointer
            </button>
          </>
        )}

        {message && !isDeparture && (
          <p className="text-center mt-4 text-green-600">
            {message}
          </p>
        )}

      </div>
    </div>
  )
}

export default ScanPage;