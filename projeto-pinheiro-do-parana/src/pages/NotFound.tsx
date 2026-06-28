import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            <h1>404</h1>

            <p>Página não encontrada.</p>

            <Link to="/">
                Voltar para o início
            </Link>
        </div>
    );
}