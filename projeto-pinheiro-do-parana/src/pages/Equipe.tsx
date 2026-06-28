import { useState, useEffect } from "react";
import { getEquipe } from "../services/dao";
import type { Equipe as EquipeType } from "../types/Equipe";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import "../styles/equipe.css";

export default function Equipe() {
    const [membros, setMembros] = useState<EquipeType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembros = async () => {
            try {
                const data = await getEquipe();
                setMembros(data);
            } catch (error) {
                console.error("Erro ao carregar equipe:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembros();
    }, []);

    return (
        <div className="equipe-page">
            <Header />

            <div className="equipe-hero">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Nossa Equipe
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Conheça os professores, pesquisadores e extensionistas que fazem este projeto acontecer.
                </motion.p>
            </div>

            <div className="equipe-container">
                {loading ? (
                    <div className="equipe-grid">
                        <div className="skeleton-membro"></div>
                        <div className="skeleton-membro"></div>
                        <div className="skeleton-membro"></div>
                        <div className="skeleton-membro"></div>
                    </div>
                ) : membros.length > 0 ? (
                    <motion.div
                        className="equipe-grid"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {membros.map((membro) => (
                            <motion.div
                                key={membro.id}
                                className="membro-card"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <div className="membro-foto-wrapper">
                                    <img
                                        src={membro.foto}
                                        alt={membro.nome}
                                        className="membro-foto"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="membro-nome">{membro.nome}</h3>
                                <p className="membro-cargo">{membro.cargo}</p>
                                {membro.email && (
                                    <a
                                        href={`mailto:${membro.email}`}
                                        className="membro-email"
                                        title={`Enviar e-mail para ${membro.nome}`}
                                    >
                                        <FaEnvelope /> {membro.email}
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div style={{ textAlign: "center", padding: "4rem", color: "#4A3B32" }}>
                        <h3>Nenhum membro da equipe cadastrado no momento.</h3>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}