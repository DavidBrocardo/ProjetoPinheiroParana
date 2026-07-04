import { useState, useEffect } from "react";
import { getNoticias } from "../services/dao";
import type { Noticia } from "../types/Noticia";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaArrowRight, FaCalendarAlt, FaTimes } from "react-icons/fa";
import "../styles/noticias.css";

export default function Noticias() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const data = await getNoticias();
                setNoticias(data);
            } catch (error) {
                console.error("Erro ao carregar notícias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, []);

    // Filtrar notícias
    const normalizedSearch = searchTerm.toLowerCase();
    const filteredNoticias = noticias.filter((noticia) => {
        const titulo = noticia?.titulo?.toLowerCase?.() ?? "";
        const descricao = noticia?.descricao?.toLowerCase?.() ?? "";
        return titulo.includes(normalizedSearch) || descricao.includes(normalizedSearch);
    });

    // Formatar data para exibição (ex: 2026-06-24 -> 24/06/2026)
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        if (year && month && day) {
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    };

    return (
        <> 
        <div className="noticias-page">
            <Header />

            <div className="noticias-hero">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Notícias e Novidades
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Fique por dentro das últimas ações de extensão, pesquisas e eventos sobre a preservação da Araucária.
                </motion.p>
            </div>

            <div className="noticias-container">
                <div className="noticias-controls">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Pesquisar notícias..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <span style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#4A3B32", opacity: 0.7 }}>
                            <FaSearch />
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-skeleton-grid">
                        <div className="skeleton-card"></div>
                        <div className="skeleton-card"></div>
                        <div className="skeleton-card"></div>
                    </div>
                ) : filteredNoticias.length > 0 ? (
                    <motion.div
                        className="noticias-grid"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 }
                            }
                        }}
                    >
                        {filteredNoticias.map((noticia) => (
                            <motion.article
                                key={noticia.id}
                                className="noticia-card"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                
                                <div className="noticia-card-content">
                                    <div className="noticia-card-date">
                                        <FaCalendarAlt style={{ marginRight: "6px" }} />
                                        {formatDate(noticia.data)}
                                    </div>
                                    <h2 className="noticia-card-title">{noticia.titulo}</h2>
                                    <p className="noticia-card-desc">
                                        {(noticia.descricao?.length ?? 0) > 130
                                            ? `${noticia.descricao?.substring(0, 130)}...`
                                            : noticia.descricao ?? ""}
                                    </p>
                                    <button
                                        className="btn-read-more"
                                        onClick={() => setSelectedNoticia(noticia)}
                                    >
                                        Leia mais <FaArrowRight />
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                ) : (
                    <div style={{ textAlign: "center", padding: "4rem", color: "#4A3B32" }}>
                        <h3>Nenhuma notícia encontrada para "{searchTerm}".</h3>
                    </div>
                )}
            </div>

            {/* MODAL PARA LER A NOTÍCIA COMPLETA */}
            <AnimatePresence>
                {selectedNoticia && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="modal-header">
                                <h3>Notícia Completa</h3>
                                <button className="btn-close" onClick={() => setSelectedNoticia(null)}>
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="noticia-modal-body">
                               
                                <div className="noticia-modal-meta">
                                    <FaCalendarAlt style={{ marginRight: "6px" }} />
                                    Postado em: <strong>{formatDate(selectedNoticia.data)}</strong>
                                </div>
                                <h2 style={{ color: "#1E3F20", fontSize: "1.8rem" }}>{selectedNoticia.titulo}</h2>
                                <p className="noticia-modal-text">{selectedNoticia.descricao ?? ""}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            
        </div>
        <Footer />
        </>
    );
}