import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { FaTree } from "react-icons/fa";
import "../styles/login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            navigate("/admin");
        } catch (err: any) {
            console.error(err);
            // Mensagens amigáveis para erros comuns do Firebase Auth
            if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
                setError("E-mail ou senha incorretos.");
            } else if (err.code === "auth/invalid-email") {
                setError("O formato do e-mail inserido é inválido.");
            } else {
                setError("Ocorreu um erro ao fazer login. Tente novamente mais tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <FaTree />
                </div>
                <h2>Painel Administrativo</h2>
                <p>Entre com suas credenciais para gerenciar o conteúdo do portal.</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="seuemail@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Sua senha secreta"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <Link to="/" className="back-home">
                    ← Voltar para o site
                </Link>
            </div>
        </div>
    );
}
