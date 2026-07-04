import Header from "../components/Header";
import Footer from "../components/Footer";
import logoUnio from "../assets/images/unio.webp";
import logoIfpr from "../assets/images/ifpr.png";
import logoUtfpr from "../assets/images/utfpr.png";
import logoZoo from "../assets/images/zoo.jpg";
import logoInp from "../assets/images/logo_inpcon.png";
import logoUffs from "../assets/images/uffs.png";
import logoProjeto from "../assets/logo.jpg";

import "../styles/sobre.css";

export default function Sobre() {
    return (
        <>
            <Header />

            <main className="container sobre">

                <header className="sobre-header">
                    <div className="sobre-logo-wrapper">
                        <img src={logoProjeto} alt="Logo do Projeto Pinheiro do Paraná" className="sobre-logo" />
                    </div>
                    <h1>
                        Projeto Pinheiro do Paraná: Semeando Florestas e Saberes
                    </h1>

                    <p>
                        O <strong>Projeto Pinheiro do Paraná: Semeando Florestas e Saberes</strong> é uma iniciativa de extensão da
                        <strong> Universidade Federal da Fronteira Sul (UFFS)</strong>, Campus Realeza,
                        dedicada à conservação e restauração ecológica da Floresta com Araucária.
                        Diante da redução crítica de mais de 90% da cobertura original desse
                        ecossistema, o projeto une ciência, comunidade regional e educação para
                        reverter a ameaça de extinção da <em>Araucaria angustifolia</em>.
                    </p>
                </header>

                <div className="sobre-grid">

                    <section className="card">
                        <h2>Nossos Objetivos</h2>

                        <ul>
                            <li>
                                <strong>Restaurar o Ecossistema:</strong> Coleta de sementes e produção de mudas em viveiros para replantio no sudoeste paranaense.
                            </li>

                            <li>
                                <strong>Educar a Comunidade:</strong> Ações pedagógicas e oficinas de educação ambiental em escolas básicas da rede pública.
                            </li>

                            <li>
                                <strong>Preservar a Fauna:</strong> Conscientização sobre a gralha-picaça (<em>Cyanocorax chrysops</em>), ave símbolo e dispersora natural.
                            </li>
                        </ul>
                    </section>

                    <section className="card">
                        <h2>Como Participar</h2>

                        <ul>
                            <li>
                                <strong>Voluntariado:</strong> Atuação em plantios, coleta de sementes e eventos escolares.
                            </li>

                            <li>
                                <strong>Parcerias Locais:</strong> Disponibilização de propriedades privadas para reflorestamento-piloto.
                            </li>

                            <li>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Siga nosso Instagram @projeto_pinheiro_do_parana
                                </a>
                            </li>
                        </ul>
                    </section>

                </div>

                <section className="sobre-parcerias card">
                    <h2>Rede de Parcerias</h2>

                    <p>
                        Nossa rede de parcerias é composta por instituições de ensino, pesquisa e conservação que compartilham nosso compromisso com a preservação do ecossistema paranaense.
                    </p>
                    <div className="sobre-grid">
                        <div className="card">
                            <div id="icones-skils">
                                <a> <img src={logoUffs} alt="Projeto Pinheiro do Paraná" /> </a>
                            </div>
                            <h3>Universidade Federal da Fronteira Sul</h3>
                        </div>
                        <div className="card">
                            <div id="icones-skils">                                
                                <a> <img src={logoUnio} alt="Projeto Pinheiro do Paraná" /> </a>
                            </div>
                            <h3>Universidade Estadual do Oeste do Paraná</h3>
                        </div>
                        <div className="card">
                            <div id="icones-skils">
                                <a><img src={logoIfpr} alt="IFPR" /></a>
                            </div>
                            <h3>Instituto Federal do Paraná</h3>
                        </div>
                        <div className="card">
                            <div id="icones-skils">
                                <a><img src={logoUtfpr} alt="UTFPR" /></a>
                            </div>
                            <h3>Universidade Tecnológica Federal do Paraná</h3>
                        </div>
                        <div className="card">
                            <div id="icones-skils">
                                <a><img src={logoInp} alt="Instituto Neotropical: Pesquisa e Conservação" /></a>
                            </div>
                            <h3>Instituto Neotropical: Pesquisa e Conservação</h3>
                        </div>
                        <div className="card">
                            <div id="icones-skils">
                                <a><img src={logoZoo} alt="Parque Municipal Danilo Galafassi" /></a>
                            </div>
                            <h3>Parque Municipal Danilo Galafassi</h3>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}