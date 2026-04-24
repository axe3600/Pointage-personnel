import { useState } from "react"

function LeaveModal({ isOpen, onClose, onSubmit }) {

  // ❌ Si fermé → rien afficher
  if (!isOpen) return null

  // 🔥 State du formulaire
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    type: "Congé payé",
    startDate: "",
    endDate: "",
    reason: ""
  })

  // 🔹 Mise à jour des champs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

 // 🔥 Soumission
  const handleSubmit = () => {

    if (!form.firstName || !form.lastName || !form.startDate) {
      alert("Remplis tous les champs obligatoires")
      return
    }

   // 🔥 Envoi vers Dashboard
   onSubmit({
    ...form, // garde le vrai type choisi
    category: "leave", // 🔥 TRÈS IMPORTANT
    date: new Date().toLocaleDateString(),
    status: "En attente"  // statut correct
  })

    // Fermer popup
    onClose()

    // Reset
    setForm({
      firstName: "",
      lastName: "",
      type: "Congé payé",
      startDate: "",
      endDate: "",
      reason: ""
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      {/* BOX */}
      <div className="bg-white w-full max-w-xl rounded-xl p-6 relative shadow-lg">

        {/* ❌ fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* TITRE */}
        <h2 className="text-lg font-semibold mb-1">
          Demande de congé
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Remplissez le formulaire
        </p>

        {/* FORM */}
        <div className="space-y-4">

          {/* NOM + PRENOM */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="Prénom"
              value={form.firstName}
              onChange={handleChange}
              className="p-2 border rounded-lg bg-gray-50"
            />

            <input
              type="text"
              name="lastName"
              placeholder="Nom"
              value={form.lastName}
              onChange={handleChange}
              className="p-2 border rounded-lg bg-gray-50"
            />
          </div>

          {/* TYPE */}
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-gray-50"
          >
            <option>Congé payé</option>
            <option>Maladie</option>
            <option>Exceptionnel</option>
          </select>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="p-2 border rounded-lg"
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="p-2 border rounded-lg"
            />
          </div>

          <textarea
            name="reason"
            value={form.reason}
            placeholder="Motif..."
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Soumettre
          </button>
        </div>

      </div>
    </div>
  )
}

export default LeaveModal;