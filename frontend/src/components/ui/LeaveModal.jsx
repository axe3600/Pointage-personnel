import { useState } from "react"
import axios from "axios"

function LeaveModal({ isOpen, onClose, onSubmit }) {

  if (!isOpen) return null

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    type: "Congé payé",
    startDate: "",
    endDate: "",
    reason: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 🔥 FIX PRINCIPAL ICI
  const handleSubmit = async () => {

    if (!form.firstName || !form.lastName || !form.startDate) {
      alert("Remplis tous les champs")
      return
    }

    try {
      await axios.post(
        "https://pointage-personnel.onrender.com/api/leaves",
        {
          ...form,
          status: "En attente",
          date: new Date().toLocaleDateString()
        }
      )

      onSubmit() // 🔥 refresh Dashboard

      onClose()

    } catch (err) {
      alert("Erreur envoi congé ❌")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-xl rounded-xl p-6 relative shadow-lg">

        <button onClick={onClose} className="absolute top-4 right-4">✕</button>

        <h2 className="text-lg font-semibold mb-4">Demande de congé</h2>

        <div className="space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" onChange={handleChange} placeholder="Prénom" className="p-2 border rounded-lg"/>
            <input name="lastName" onChange={handleChange} placeholder="Nom" className="p-2 border rounded-lg"/>
          </div>

          <select name="type" onChange={handleChange} className="p-2 border rounded-lg">
            <option>Congé payé</option>
            <option>Maladie</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input type="date" name="startDate" onChange={handleChange} className="p-2 border"/>
            <input type="date" name="endDate" onChange={handleChange} className="p-2 border"/>
          </div>

          <textarea name="reason" onChange={handleChange} className="p-2 border"/>

        </div>

        <button onClick={handleSubmit} className="mt-4 bg-blue-600 text-white p-2 rounded">
          Soumettre
        </button>

      </div>
    </div>
  )
}

export default LeaveModal