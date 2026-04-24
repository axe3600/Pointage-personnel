import { useState } from "react"

function ScanPage() {

  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const handleScan = (type) => {

    if (!name) return alert("Entre ton nom")

    fetch("http://localhost:5000/api/pointages/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, type })
    })
    .then(res => res.json())
    .then(data => {

      // 🔥 Sauvegarde local
      const saved = JSON.parse(localStorage.getItem("pointages")) || []
      saved.push(data)
      localStorage.setItem("pointages", JSON.stringify(saved))

      setMessage(
        type === "arrival"
          ? `✅ Arrivée enregistrée à ${data.arrival}`
          : `✅ Départ enregistré à ${data.departure}`
      )
    })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">

      <div className="bg-white p-6 rounded-2xl shadow w-[320px]">

        <h2 className="text-lg font-semibold mb-4 text-center">
          Pointage rapide
        </h2>

        {/* NOM */}
        <input
          type="text"
          placeholder="Ton nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* BOUTONS */}
        <div className="flex gap-2 mb-3">

          <button
            onClick={() => handleScan("arrival")}
            className="flex-1 bg-green-500 text-white p-2 rounded"
          >
            Arrivée
          </button>

          <button
            onClick={() => handleScan("departure")}
            className="flex-1 bg-black text-white p-2 rounded"
          >
            Départ
          </button>

        </div>

        {/* MESSAGE */}
        {message && (
          <p className="text-center text-sm text-green-600">
            {message}
          </p>
        )}

      </div>
    </div>
  )
}

export default ScanPage;