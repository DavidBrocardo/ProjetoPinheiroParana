import "../styles/hero.css";
import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="hero">

            <div className="overlay">

                <h1>
                    Projeto Pinheiro do Paraná
                </h1>

                <p>
                    Conservação da Araucária através da educação
                    ambiental, pesquisa e extensão universitária.
                </p>

                <Link to="/sobre" className="btn">
                    Saiba mais
                </Link>

            </div>

        </section>
    );
}