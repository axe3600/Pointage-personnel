import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import ScanPage from "./pages/ScanPage"
import EmployeePage from "./pages/EmployeePage"
import HistoriqueGlobal from "./pages/HistoriqueGlobal"

function App() {
  return (
    <BrowserRouter>

      <Routes>
        {/* Page principale */}
        <Route path="/" element={<Dashboard />} />

        {/* 🔥 PAGE QR SCAN */}
        <Route path="/scan" element={<ScanPage />} />

           {/* 🔥 enregistrement employé */}
        <Route path="/Enregistrement-Employe" element={<EmployeePage />} />

        <Route path="/historique-global" element={<HistoriqueGlobal />}
/>
      </Routes>

    </BrowserRouter>
  )
}

export default App;