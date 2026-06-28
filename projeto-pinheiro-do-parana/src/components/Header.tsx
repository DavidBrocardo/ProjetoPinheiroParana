import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import "../styles/header.css";

const menuItems = [
    { to: "/", label: "Início" },
    { to: "/sobre", label: "Sobre" },
    { to: "/galeria", label: "Galeria" },
    { to: "/noticias", label: "Notícias" },
    { to: "/equipe", label: "Equipe" },
    { to: "/contato", label: "Contato" },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <section id="cabecalho">
            <div className="menu-container">
                <div className="menu-box">
                    <div className="menu-logo">
                        <Link to="/" onClick={closeMenu}>
                            <img src={logo} alt="Projeto Pinheiro do Paraná" />
                        </Link>
                    </div>

                    <button
                        type="button"
                        className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-controls="menu-navigation"
                        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                    >
                        <span />
                        <span />
                        <span />
                    </button>

                    <nav
                        id="menu-navigation"
                        className={`menu-links ${isMenuOpen ? "open" : ""}`}
                        aria-label="Navegação principal"
                    >
                        {menuItems.map((item) => (
                            <Link key={item.to} to={item.to} onClick={closeMenu}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </section>
    );
}