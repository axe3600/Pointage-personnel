import { useState, useEffect } from "react"
import axios from "axios"
import { FaClipboardList } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function EmployeePage() {

  const navigate = useNavigate() // ✅ bien placé

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

  const [employees, setEmployees] = useState([])

  // 🔐 PROTECTION PAGE
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth")
    if (isAuth !== "true") {
      navigate("/")
    }
  }, [navigate])

  // 🔥 Charger employés (CORRIGÉ)
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees")
      setEmployees(res.data)
    } catch (err) {
      console.error("Erreur fetch employés :", err)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  // 🔥 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 🔥 SUPPRESSION (CORRIGÉ)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`)
      fetchEmployees()
    } catch (err) {
      console.error("Erreur suppression :", err)
      alert("Erreur lors de la suppression ❌")
    }
  }

  // 🔥 SUBMIT (CORRIGÉ)
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // ✅ Validation simple
      if (!form.firstName || !form.lastName) {
        return alert("Remplis au moins prénom et nom")
      }

      const res = await axios.post(
        "http://localhost:5000/api/employees",
        form
      )

      console.log("Employé ajouté :", res.data)

      // 🔄 Reset form
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

      // 🔄 Refresh liste
      fetchEmployees()

    } catch (err) {
      console.error("Erreur ajout employé :", err)
      alert("Erreur lors de l'enregistrement ❌")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mt-10">
  
      {/* 🔥 HEADER */}
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
        {/* 🔥 FORMULAIRE */}
        {/* ===================== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-4 border"
        >
          <h3 className="font-semibold text-gray-700 mb-2">
            Nouvel Employé
          </h3>
  
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Prénom"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" />
  
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Nom"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" />
  
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" />
  
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Téléphone"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" />
  
          <input name="position" value={form.position} onChange={handleChange} placeholder="Poste"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" />
  
          <select name="department" value={form.department} onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none">
            <option value="">Département</option>
            <option>IT</option>
            <option>RH</option>
            <option>Finance</option>
          </select>
  
          <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" />
  
          <textarea name="address" value={form.address} onChange={handleChange} placeholder="Adresse"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none" />
  
          <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-xl font-semibold hover:opacity-90 transition">
            Enregistrer l'employé
          </button>
        </form>
  
        {/* ===================== */}
        {/* 🔥 LISTE */}
        {/* ===================== */}
        <div className="bg-white p-6 rounded-2xl shadow border">
  
          <h3 className="font-semibold text-gray-700 mb-4">
            Employés enregistrés ({employees.length})
          </h3>
  
          {employees.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">👤</p>
              Aucun employé enregistré
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
  
              {employees.map((emp) => (
                <div
                  key={emp._id}
                  className="p-4 border rounded-xl hover:shadow-sm transition bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {emp.firstName} {emp.lastName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {emp.position} • {emp.department}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      📧 {emp.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm("Supprimer cet employé ?")) {
                        handleDelete(emp._id)
                      }
                    }}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
  
            </div>
          )}
  
        </div>
  
      </div>
    </div>
  )
}

export default EmployeePage;