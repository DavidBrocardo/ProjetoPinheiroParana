import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import StatisticCard from "../components/StatisticCard";

export default function Home() {
    return (
        <>
            <Header />

            <Hero />

            <section className="sobre">
                <div className="container">

                    <h2 >Sobre o Projeto</h2>

                    <p>
                     O Projeto Pinheiro do Paraná: Semeando Florestas e Saberes é uma iniciativa de extensão da Universidade Federal da Fronteira Sul (UFFS), Campus Realeza, dedicada à conservação e restauração ecológica da Floresta com Araucária. Diante da redução crítica de mais de 90% da cobertura original desse ecossistema, o projeto une ciência, comunidade regional e educação para reverter a ameaça de extinção da Araucaria angustifolia.
                    </p>

                </div>
            </section>

            <section className="numeros">
                <div className="container">

                    <StatisticCard
                        titulo="+500"
                        descricao="Alunos Impactados"
                    />

                    <StatisticCard
                        titulo="+1000"
                        descricao="Mudas Produzidas"
                    />

                    <StatisticCard
                        titulo="10"
                        descricao="Municípios Atendidos"
                    />

                </div>
            </section>

            <Footer />
        </>
    );
}