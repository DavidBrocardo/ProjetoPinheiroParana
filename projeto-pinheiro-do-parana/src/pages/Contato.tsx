import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import instagramIcon from "../assets/instagram.png";

const contatos = [
    {
        icone: "✉️",
        titulo: "E-mail",
        valor: "contato@pinheirodoparana.org.br",
        href: "mailto:contato@pinheirodoparana.org.br"
    },
    {
        icone: "📸",
        imagem: instagramIcon,
        titulo: "Instagram",
        valor: "@projeto_pinheiro_do_parana",
        href: "https://www.instagram.com/projeto_pinheiro_do_parana/"
    },
    {
        icone: "📞",
        titulo: "Telefone",
        valor: "(45) 99948-6625",
        href: "tel:+5545999486625"
    },
    {
        icone: "📍",
        titulo: "Endereço",
        valor: "Rodovia PR 182, km 466,Caixa Postal 253,Realeza, PR",
        href: "https://maps.app.goo.gl/uoNDejwSeqJRGJLL9"
    }
];

export default function Contato() {
    return (
        <>
            <Header />

            <main className="contato-page">
                <section className="contato-hero">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Fale com a gente
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Estamos prontos para ouvir você. Seja para parcerias, voluntariado ou visitas, aqui você encontra nossos principais canais de contato.
                    </motion.p>
                </section>

                <section className="contato-grid container">
                    {contatos.map((item) => (
                        <a
                            key={item.titulo}
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                            className="contato-card"
                        >
                            <span className="contato-icon">
                                {item.imagem ? (
                                    <img
                                        src={item.imagem}
                                        alt={item.titulo}
                                        className="contato-icon-img"
                                    />
                                ) : (
                                    item.icone
                                )}
                            </span>
                            <h3>{item.titulo}</h3>
                            <p>{item.valor}</p>
                        </a>
                    ))}
                </section>
            </main>

            <Footer />
        </>
    );
}