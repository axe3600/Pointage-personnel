import { useState } from "react"

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
    alert("Remplis tous les champs obligatoires")
    return
  }

  try {

    await onSubmit({
      ...form,
      date: new Date().toISOString(),
      status: "En attente"
    })

    onClose()

  } catch (err) {

    console.log(err)
    alert("Erreur envoi congé ❌")
  }
}

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-xl rounded-xl p-6 relative shadow-lg">

        <button onClick={onClose} className="absolute top-4 right-4">✕</button>

        <h2 className="text-lg font-semibold mb-1">
          Demande de congé
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Remplissez le formulaire
        </p>

        <div className="space-y-4">

        <div className="grid grid-cols-2 gap-3">
            <input name="firstName" onChange={handleChange} placeholder="Prénom" className="p-2 border rounded-lg"/>
            <input name="lastName" onChange={handleChange} placeholder="Nom" className="p-2 border rounded-lg"/>
        </div>

          <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded-lg bg-gray-50">
            <option>Congé payé</option>
            <option>Maladie</option>
            <option>Exceptionnel</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input type="date" name="startDate" onChange={handleChange} className="p-2 border rounded-lg"/>
            <input type="date" name="endDate" onChange={handleChange} className="p-2 border rounded-lg"/>
          </div>

          <textarea name="reason" placeholder="Motif..." onChange={handleChange} className="w-full p-2 border rounded-lg"/>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">
            Annuler
          </button>

          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Soumettre
          </button>
        </div>

      </div>
    </div>
  )
}

export default LeaveModal