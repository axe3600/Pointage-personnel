import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import ScanPage from "./pages/ScanPage"
import EmployeePage from "./pages/EmployeePage"

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
      </Routes>

    </BrowserRouter>
  )
}

export default App;