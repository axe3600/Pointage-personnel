import { useState, useEffect } from "react"
import axios from "axios"
import API from "../api"
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaArrowLeft
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function EmployeePage() {

  const navigate = useNavigate()

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

  // 🔐 Protection
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth")
    if (isAuth !== "true") {
      navigate("/")
    }
  }, [navigate])

  // 🔥 Fetch employés
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/api/employees`)
      setEmployees(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!form.firstName || !form.lastName) {
        return alert("Remplis au moins prénom et nom")
      }

      await axios.post(`${API}/api/employees`, form)

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

      fetchEmployees()

    } catch (err) {
      console.error(err)
      alert("Erreur ❌")
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/employees/${id}`)
      fetchEmployees()
    } catch (err) {
      alert("Erreur suppression ❌")
    }
  }

  // 🎯 UI
  return (
    <div className="max-w-7xl mx-auto px-6 mt-10">

      {/* 🔙 BOUTON RETOUR */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-black"
      >
        <FaArrowLeft />
        Retour
      </button>

      {/* 🔥 HEADER FIX */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow mb-8">

        <div className="flex items-center gap-4">

          <div className="bg-white text-indigo-600 p-3 rounded-xl text-xl">
            <FaUserPlus />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Espace Administrateur
            </h2>

            <p className="text-sm opacity-90">
              Enregistrement des nouveaux employés
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ===================== */}
        {/* FORMULAIRE */}
        {/* ===================== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-4 border"
        >
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaUserPlus />
            Nouvel Employé
          </h3>

          {/* INPUT AVEC ICÔNE */}
          <div className="flex items-center border rounded-xl px-3">
            <FaUser className="text-gray-400" />
            <input name="firstName" value={form.firstName} onChange={handleChange}
              placeholder="Prénom"
              className="w-full p-3 outline-none" />
          </div>

          <div className="flex items-center border rounded-xl px-3">
            <FaUser className="text-gray-400" />
            <input name="lastName" value={form.lastName} onChange={handleChange}
              placeholder="Nom"
              className="w-full p-3 outline-none" />
          </div>

          <div className="flex items-center border rounded-xl px-3">
            <FaEnvelope className="text-gray-400" />
            <input name="email" value={form.email} onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 outline-none" />
          </div>

          <div className="flex items-center border rounded-xl px-3">
            <FaPhone className="text-gray-400" />
            <input name="phone" value={form.phone} onChange={handleChange}
              placeholder="Téléphone"
              className="w-full p-3 outline-none" />
          </div>

          <div className="flex items-center border rounded-xl px-3">
            <FaBriefcase className="text-gray-400" />
            <input name="position" value={form.position} onChange={handleChange}
              placeholder="Poste"
              className="w-full p-3 outline-none" />
          </div>

          <div className="flex items-center border rounded-xl px-3">
            <FaBuilding className="text-gray-400" />
            <select name="department" value={form.department} onChange={handleChange}
              className="w-full p-3 outline-none bg-transparent">
              <option value="">Département</option>
              <option>IT</option>
              <option>Communication</option>
              <option>RH</option>
              <option>Finance</option>
            </select>
          </div>

          <input type="date" name="hireDate"
            value={form.hireDate} onChange={handleChange}
            className="w-full p-3 border rounded-xl" />

          <div className="flex items-start border rounded-xl px-3">
            <FaMapMarkerAlt className="text-gray-400 mt-3" />
            <textarea name="address" value={form.address} onChange={handleChange}
              placeholder="Adresse"
              className="w-full p-3 outline-none" />
          </div>

          <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-xl font-semibold hover:opacity-90">
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
              <div key={emp._id}
                className="p-4 border rounded-xl flex justify-between items-center mb-2 hover:shadow">

                <div>
                  <p className="font-medium">
                    {emp.firstName} {emp.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {emp.position} • {emp.department}
                  </p>

                   {/* ✅ AJOUT */}
                  <p className="text-xs text-indigo-500 mt-1">
                    🆔 {emp.matricule}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(emp._id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200"
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