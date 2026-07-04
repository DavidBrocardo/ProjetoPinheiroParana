import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const contatos = [
    {
        icone: "✉️",
        titulo: "E-mail",
        valor: "contato@pinheirodoparana.org.br",
        href: "mailto:contato@pinheirodoparana.org.br"
    },
    {
        icone: "📸",
        titulo: "Instagram",
        valor: "@pinheirodoparana",
        href: "https://www.instagram.com/"
    },
    {
        icone: "📞",
        titulo: "Telefone",
        valor: "(41) 99999-9999",
        href: "tel:+5541999999999"
    },
    {
        icone: "📍",
        titulo: "Endereço",
        valor: "Rua das Araucárias, 123 - Curitiba/PR",
        href: "https://maps.google.com/?q=Rua+das+Arauc%C3%A1rias,+123,+Curitiba"
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
                            <span className="contato-icon">{item.icone}</span>
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