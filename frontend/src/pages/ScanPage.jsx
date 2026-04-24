import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

function ScanPage() {

  const [params] = useSearchParams()

  const name = params.get("name")
  const type = params.get("type")

  useEffect(() => {

    if (!name || !type) return

    fetch("http://localhost:5000/api/pointages/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, type })
    })
    .then(res => res.json())
    .then(data => {

      // 🔥 SAUVEGARDE LOCAL
      const saved = JSON.parse(localStorage.getItem("pointages")) || []
      saved.push(data)
      localStorage.setItem("pointages", JSON.stringify(saved))

      alert(
        type === "arrival"
          ? `Arrivée enregistrée à ${data.arrival}`
          : `Départ enregistré ;à ${data.departure}`
      )
    })

  }, [])

  return (
    <div className="h-screen flex items-center justify-center">
      <h2 className="text-xl">Scan en cours...</h2>
    </div>
  )
}

export default ScanPage