import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

import {
    FaArrowLeft,
    FaMoneyCheckAlt,
    FaTrash,
    FaCalendarAlt,
    FaFilePdf,
    FaFileExcel
  } from "react-icons/fa"

function HistoriquePaiements() {

  const navigate = useNavigate()

  // =========================
  // 🔥 STATES
  // =========================
  const [salaires, setSalaires] = useState([])

  // =========================
  // 🔥 API
  // =========================
  const API =
    "https://pointage-personnel.onrender.com/api"

  // =========================
  // 🔥 FETCH SALAIRES
  // =========================
  const fetchSalaires = async () => {

    try {

      const res = await axios.get(
        `${API}/salaires`
      )

      setSalaires(res.data || [])

    } catch (err) {

      console.log(err)

    }
  }

  // =========================
  // 🔥 DELETE SALAIRE
  // =========================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Supprimer ce paiement ?"
    )

    if (!confirmDelete) return

    try {

      await axios.delete(
        `${API}/salaires/${id}`
      )

      fetchSalaires()

      alert("✅ Paiement supprimé")

    } catch (err) {

      console.log(err)

      alert("❌ Erreur suppression")
    }
  }

  // =========================
  // 🔥 LOAD
  // =========================
  useEffect(() => {

    fetchSalaires()

  }, [])

  // 🔥 Données exporté en pdf
  const exportPDF = () => {

    const doc = new jsPDF()
  
    doc.text(
      "Historique des Paiements",
      14,
      15
    )
  
    const tableData = salaires.map((s) => [
      s.employe,
      s.mois,
      s.annee,
      s.salaireNet?.toFixed(2),
      s.devise,
      s.statut
    ])
  
    autoTable(doc, {
      startY: 25,
      head: [[
        "Employé",
        "Mois",
        "Année",
        "Salaire Net",
        "Devise",
        "Statut"
      ]],
      body: tableData
    })
  
    doc.save("historique-paiements.pdf")
  
  }

  // 🔥 Données exporté en excel
  const exportExcel = () => {

    const excelData = salaires.map((s) => ({
      Employe: s.employe,
      Mois: s.mois,
      Annee: s.annee,
      SalaireNet: s.salaireNet,
      Devise: s.devise,
      Statut: s.statut
    }))
  
    const worksheet =
      XLSX.utils.json_to_sheet(excelData)
  
    const workbook =
      XLSX.utils.book_new()
  
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Paiements"
    )
  
    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      })
  
    const data = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
      }
    )
  
    saveAs(
      data,
      "historique-paiements.xlsx"
    )
  
  }  

  return (

    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "#ee821e9d"
      }}
    >

      {/* ========================= */}
      {/* 🔥 TOP BAR */}
      {/* ========================= */}

      <div className="flex justify-between items-center mb-8">

        <button
          onClick={() => navigate("/historique-global")}
          className="
            flex
            items-center
            gap-3
            bg-gradient-to-r
            from-orange-500
            to-pink-500
            text-white
            px-6
            py-3
            rounded-2xl
            shadow-lg
            hover:scale-105
            transition
          "
        >
          <FaArrowLeft />
          Retour
        </button>

      </div>

      {/* ========================= */}
      {/* 🔥 HERO */}
      {/* ========================= */}

      <div className="
        bg-white/80
        backdrop-blur-md
        border
        rounded-3xl
        p-8
        shadow-xl
        mb-10
      ">

        <div className="flex items-center gap-4 mb-4">

          <div className="
            bg-green-600
            text-white
            p-4
            rounded-2xl
          ">
            <FaMoneyCheckAlt className="text-2xl" />
          </div>

          <div>

            <span className="
              bg-green-100
              text-green-700
              px-4
              py-1
              rounded-full
              text-sm
              font-semibold
            ">
              Historique
            </span>

            <h1 className="
              text-5xl
              font-extrabold
              text-gray-800
              mt-3
            ">
              Historique des Paiements
            </h1>

          </div>

        </div>

        <p className="text-gray-600 text-lg">
          Consultez tous les salaires validés.
        </p>

      </div>

      {/* ========================= */}
      {/* 🔥 TABLE */}
      {/* ========================= */}

      <div className="
        bg-white
        rounded-3xl
        p-6
        shadow-lg
        border
      ">

        <div className="
          flex
          items-center
          gap-3
          mb-6
        ">

          <FaCalendarAlt />

          <h2 className="text-2xl font-bold">
            Paiements enregistrés
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="
                text-left
                text-gray-400
                border-b
              ">

                <th className="pb-4">
                  Employé
                </th>

                <th className="pb-4">
                  Mois
                </th>

                <th className="pb-4">
                  Année
                </th>

                <th className="pb-4">
                  Salaire net
                </th>

                <th className="pb-4">
                  Devise
                </th>

                <th className="pb-4">
                  Statut
                </th>

                <th className="pb-4">
                  Date paiement
                </th>

                <th className="pb-4">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {salaires.map((salaire, i) => (

                <tr
                  key={i}
                  className="
                    border-b
                    hover:bg-gray-50
                    transition
                  "
                >

                  {/* EMPLOYÉ */}
                  <td className="py-5 font-semibold">
                    {salaire.employe}
                  </td>

                  {/* MOIS */}
                  <td>
                    {salaire.mois}
                  </td>

                  {/* ANNÉE */}
                  <td>
                    {salaire.annee}
                  </td>

                  {/* SALAIRE */}
                  <td className="
                    font-bold
                    text-green-600
                  ">
                    {salaire.salaireNet?.toFixed(2)}{" "}
                    {salaire.devise}
                  </td>

                  {/* DEVISE */}
                  <td>
                    {salaire.devise}
                  </td>

                  {/* STATUT */}
                  <td>

                    <span className="
                      bg-green-100
                      text-green-700
                      px-3
                      py-1
                      rounded-full
                      text-xs
                    ">
                      {salaire.statut}
                    </span>

                  </td>

                  {/* DATE */}
                  <td>

                    {new Date(
                      salaire.datePaiement
                    ).toLocaleDateString()}

                  </td>

                  {/* ACTION */}
                  <td>

                    <button
                      onClick={() =>
                        handleDelete(salaire._id)
                      }
                      className="
                        bg-red-100
                        text-red-600
                        p-3
                        rounded-xl
                        hover:bg-red-500
                        hover:text-white
                        transition
                      "
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
<br/>
          {/* ACTIONS */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border">

            <h2 className="font-bold text-xl mb-6">
              Actions
            </h2>

            <div className="flex gap-4 flex-wrap">

              <button onClick={exportPDF} className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition flex items-center gap-2">
                <FaFilePdf />
                Exporter PDF
              </button>

              <button onClick={exportExcel} className="bg-green-600 text-white px-6 py-3 rounded-2xl hover:scale-105 transition flex items-center gap-2">
                <FaFileExcel />
                Exporter Excel
              </button>

            </div>

          </div>

    </div>
  )
}

export default HistoriquePaiements;