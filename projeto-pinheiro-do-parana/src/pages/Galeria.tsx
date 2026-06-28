import { useState, useEffect } from "react";
import { getGaleria } from "../services/dao";
import type { Galeria as GaleriaType } from "../types/Galeria";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSearchPlus } from "react-icons/fa";
import "../styles/galeria.css";

const CATEGORIES = ["Todos", "Educação", "Ações de Extensão", "Pesquisa Científica", "Conservação"];

export default function Galeria() {
    const [images, setImages] = useState<GaleriaType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<GaleriaType | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await getGaleria();
                setImages(data);
            } catch (error) {
                console.error("Erro ao carregar galeria:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    // Filtrar imagens por categoria
    const filteredImages = selectedCategory === "Todos"
        ? images
        : images.filter((img) => img.categoria === selectedCategory);

    return (
        <div className="galeria-page">
            <Header />

            <div className="galeria-hero">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Galeria de Fotos
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Veja imagens registradas de nossas expedições, pesquisas e oficinas educacionais pelo Paraná.
                </motion.p>
            </div>

            <div className="galeria-container">
                {/* Filtros */}
                <div className="galeria-filters">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="galeria-grid">
                        <div className="skeleton-item"></div>
                        <div className="skeleton-item"></div>
                        <div className="skeleton-item"></div>
                        <div className="skeleton-item"></div>
                        <div className="skeleton-item"></div>
                        <div className="skeleton-item"></div>
                    </div>
                ) : filteredImages.length > 0 ? (
                    <motion.div
                        className="galeria-grid"
                        layout
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.08 }
                            }
                        }}
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredImages.map((image) => (
                                <motion.div
                                    key={image.id}
                                    className="galeria-item"
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    onClick={() => setLightboxImage(image)}
                                >
                                    <img src={image.imagem} alt={image.titulo} className="galeria-img" loading="lazy" />
                                    <div className="galeria-overlay">
                                        <div style={{ alignSelf: "center", marginBottom: "auto", marginTop: "auto", fontSize: "1.5rem" }}>
                                            <FaSearchPlus />
                                        </div>
                                        <h3 className="galeria-item-title">{image.titulo}</h3>
                                        <p className="galeria-item-category">{image.categoria}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div style={{ textAlign: "center", padding: "4rem", color: "#4A3B32" }}>
                        <h3>Nenhuma foto cadastrada nesta categoria.</h3>
                    </div>
                )}
            </div>

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        className="lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
                            <FaTimes />
                        </button>
                        <div className="lightbox-img-wrapper">
                            <motion.img
                                src={lightboxImage.imagem}
                                alt={lightboxImage.titulo}
                                className="lightbox-img"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                            />
                        </div>
                        <div className="lightbox-caption">
                            <h3>{lightboxImage.titulo}</h3>
                            <p>{lightboxImage.categoria}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}