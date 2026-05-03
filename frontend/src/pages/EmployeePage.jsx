import { useState, useEffect } from "react"
import axios from "axios"
import API from "../api" // ✅ URL backend centralisée ici
import { FaClipboardList } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function EmployeePage() {

  const navigate = useNavigate()

  // =========================
  // 🔥 FORMULAIRE EMPLOYÉ
  // =========================
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    hireDate: "",
    address: ""
  })

  // =========================
  // 🔥 LISTE DES EMPLOYÉS
  // =========================
  const [employees, setEmployees] = useState([])

  // =========================
  // 🔐 PROTECTION PAGE LOGIN
  // =========================
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth")
    if (isAuth !== "true") {
      navigate("/")
    }
  }, [navigate])

  // =========================
  // 🔥 CHARGER LES EMPLOYÉS
  // =========================
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/api/employees`) // ✅ API centralisée
      setEmployees(res.data)
    } catch (err) {
      console.error("Erreur fetch employés :", err)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  // =========================
  // 🔥 INPUT FORM
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // =========================
  // 🔥 AJOUT EMPLOYÉ
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!form.firstName || !form.lastName) {
        return alert("Remplis au moins prénom et nom")
      }

      const res = await axios.post(
        `${API}/api/employees`, // ✅ API centralisée
        form
      )

      console.log("Employé ajouté :", res.data)

      // 🔄 reset formulaire
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        hireDate: "",
        address: ""
      })

      // 🔄 refresh liste
      fetchEmployees()

    } catch (err) {
      console.error("Erreur ajout employé :", err)
      alert("Erreur lors de l'enregistrement ❌")
    }
  }

  // =========================
  // 🔥 SUPPRESSION EMPLOYÉ
  // =========================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/employees/${id}`) // ✅ API centralisée
      fetchEmployees()
    } catch (err) {
      console.error("Erreur suppression :", err)
      alert("Erreur lors de la suppression ❌")
    }
  }

  // =========================
  // 🎯 UI
  // =========================
  return (
    <div className="max-w-7xl mx-auto px-6 mt-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-xl">
            <FaClipboardList />
          </div>
          <h2 className="text-xl font-semibold">Espace Administrateur</h2>
        </div>
        <p className="text-sm opacity-90">
          Enregistrement des nouveaux employés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ===================== */}
        {/* FORMULAIRE */}
        {/* ===================== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-4 border"
        >
          <h3 className="font-semibold text-gray-700 mb-2">
            Nouvel Employé
          </h3>

          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Prénom"
            className="w-full p-3 border rounded-xl" />

          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Nom"
            className="w-full p-3 border rounded-xl" />

          <input name="email" value={form.email} onChange={handleChange} placeholder="Email"
            className="w-full p-3 border rounded-xl" />

          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Téléphone"
            className="w-full p-3 border rounded-xl" />

          <input name="position" value={form.position} onChange={handleChange} placeholder="Poste"
            className="w-full p-3 border rounded-xl" />

          <select name="department" value={form.department} onChange={handleChange}
            className="w-full p-3 border rounded-xl">
            <option value="">Département</option>
            <option>IT</option>
            <option>RH</option>
            <option>Finance</option>
          </select>

          <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange}
            className="w-full p-3 border rounded-xl" />

          <textarea name="address" value={form.address} onChange={handleChange} placeholder="Adresse"
            className="w-full p-3 border rounded-xl" />

          <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-xl">
            Enregistrer l'employé
          </button>
        </form>

        {/* ===================== */}
        {/* LISTE EMPLOYÉS */}
        {/* ===================== */}
        <div className="bg-white p-6 rounded-2xl shadow border">

          <h3 className="font-semibold text-gray-700 mb-4">
            Employés enregistrés ({employees.length})
          </h3>

          {employees.length === 0 ? (
            <p className="text-center text-gray-400">Aucun employé</p>
          ) : (
            employees.map(emp => (
              <div key={emp._id} className="p-4 border rounded-xl flex justify-between items-center mb-2">

                <div>
                  <p className="font-medium">
                    {emp.firstName} {emp.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {emp.position} • {emp.department}
                  </p>
                </div>

               {/* ✅ AJOUT */}
                  <p className="text-xs text-indigo-500">
                      Matricule : {emp.matricule}
                  </p>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-lg"
                >
                  Supprimer
                </button>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  )
}

export default EmployeePage;