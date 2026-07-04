import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Sobre from "../pages/Sobre";
//import Galeria from "../pages/Galeria";
import Noticias from "../pages/Noticias";
import Equipe from "../pages/Equipe";
import Contato from "../pages/Contato";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/sobre" element={<Sobre />} />

                {/* <Route path="/galeria" element={<Galeria />} /> */}

                <Route path="/noticias" element={<Noticias />} />

                <Route path="/equipe" element={<Equipe />} />

                <Route path="/contato" element={<Contato />} />

                <Route path="/login" element={<Login />} />
                
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}