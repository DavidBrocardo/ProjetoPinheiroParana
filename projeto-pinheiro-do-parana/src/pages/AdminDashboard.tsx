import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import {
    getNoticias,
    addNoticia,
    updateNoticia,
    deleteNoticia,
    getGaleria,
    addGaleria,
    updateGaleria,
    deleteGaleria,
    getEquipe,
    addEquipe,
    updateEquipe,
    deleteEquipe,
    uploadImage
} from "../services/dao";
import type { Noticia } from "../types/Noticia";
import type { Galeria } from "../types/Galeria";
import type { Equipe } from "../types/Equipe";
import {
    FaNewspaper,
    FaImages,
    FaUsers,
    FaSignOutAlt,
    FaPlus,
    FaTree,
    FaTimes
} from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "../styles/admin.css";

type Tab = "noticias" | "galeria" | "equipe";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("noticias");

    // Estados dos dados
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [galeria, setGaleria] = useState<Galeria[]>([]);
    const [equipe, setEquipe] = useState<Equipe[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // Estados dos Modais e Formulários
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Inputs do formulário (comuns a todas as entidades)
    const [fieldTitulo, setFieldTitulo] = useState("");
    const [fieldDescricao, setFieldDescricao] = useState("");
    const [fieldImagemFile, setFieldImagemFile] = useState<File | null>(null);
    const [fieldImagemUrl, setFieldImagemUrl] = useState(""); // para manter quando edita
    const [fieldData, setFieldData] = useState("");
    const [fieldCategoria, setFieldCategoria] = useState("Educação");
    const [fieldNome, setFieldNome] = useState("");
    const [fieldCargo, setFieldCargo] = useState("");
    const [fieldEmail, setFieldEmail] = useState("");

    // Carregar dados de acordo com a aba ativa
    const loadCurrentTabDocs = async () => {
        setLoadingData(true);
        try {
            if (activeTab === "noticias") {
                const data = await getNoticias();
                setNoticias(data);
            } else if (activeTab === "galeria") {
                const data = await getGaleria();
                setGaleria(data);
            } else if (activeTab === "equipe") {
                const data = await getEquipe();
                setEquipe(data);
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        loadCurrentTabDocs();
    }, [activeTab]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    // Limpar formulário
    const resetForm = () => {
        setEditingId(null);
        setFieldTitulo("");
        setFieldDescricao("");
        setFieldImagemFile(null);
        setFieldImagemUrl("");
        setFieldData(new Date().toISOString().split("T")[0]);
        setFieldCategoria("Educação");
        setFieldNome("");
        setFieldCargo("");
        setFieldEmail("");
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: any) => {
        resetForm();
        setEditingId(item.id);
        if (activeTab === "noticias") {
            setFieldTitulo(item.titulo);
            setFieldDescricao(item.descricao);
            setFieldData(item.data);
            setFieldImagemUrl(item.imagem);
        } else if (activeTab === "galeria") {
            setFieldTitulo(item.titulo);
            setFieldCategoria(item.categoria);
            setFieldImagemUrl(item.imagem);
        } else if (activeTab === "equipe") {
            setFieldNome(item.nome);
            setFieldCargo(item.cargo);
            setFieldEmail(item.email);
            setFieldImagemUrl(item.foto); // foto do membro
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    // SUBMIT DO FORMULÁRIO (ADD / EDIT)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let finalImageUrl = fieldImagemUrl;

            // Se um novo arquivo de imagem foi selecionado, faz o upload primeiro
            if (fieldImagemFile) {
                const folderName = activeTab; // 'noticias', 'galeria' ou 'equipe'
                finalImageUrl = await uploadImage(fieldImagemFile, folderName);
            }

            if (activeTab === "noticias") {
                const noticiaData = {
                    titulo: fieldTitulo,
                    descricao: fieldDescricao,
                    data: fieldData || new Date().toISOString().split("T")[0],
                    imagem: finalImageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop"
                };

                if (editingId) {
                    await updateNoticia(editingId, noticiaData);
                } else {
                    await addNoticia(noticiaData);
                }
            } else if (activeTab === "galeria") {
                const galeriaData = {
                    titulo: fieldTitulo,
                    categoria: fieldCategoria,
                    imagem: finalImageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop"
                };

                if (editingId) {
                    await updateGaleria(editingId, galeriaData);
                } else {
                    await addGaleria(galeriaData);
                }
            } else if (activeTab === "equipe") {
                const equipeData = {
                    nome: fieldNome,
                    cargo: fieldCargo,
                    email: fieldEmail,
                    foto: finalImageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
                };

                if (editingId) {
                    await updateEquipe(editingId, equipeData);
                } else {
                    await addEquipe(equipeData);
                }
            }

            // Recarregar tabela e fechar modal
            await loadCurrentTabDocs();
            handleCloseModal();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar as informações. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    // DELETAR ITEM
    const handleDelete = async (id: string, imageUrl?: string) => {
        if (!window.confirm("Deseja realmente excluir este item? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            if (activeTab === "noticias") {
                await deleteNoticia(id, imageUrl);
            } else if (activeTab === "galeria") {
                await deleteGaleria(id, imageUrl);
            } else if (activeTab === "equipe") {
                await deleteEquipe(id, imageUrl);
            }
            await loadCurrentTabDocs();
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao excluir. Tente novamente.");
        }
    };

    return (
        <div className="admin-container">
            {/* Header Administrativo */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <FaTree size={24} />
                    <h1>Projeto Pinheiro do Paraná — Admin</h1>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Sair
                </button>
            </header>

            <main className="admin-content">
                {/* Abas de Navegação */}
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === "noticias" ? "active" : ""}`}
                        onClick={() => setActiveTab("noticias")}
                    >
                        <FaNewspaper /> Notícias
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "galeria" ? "active" : ""}`}
                        onClick={() => setActiveTab("galeria")}
                    >
                        <FaImages /> Galeria
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "equipe" ? "active" : ""}`}
                        onClick={() => setActiveTab("equipe")}
                    >
                        <FaUsers /> Equipe
                    </button>
                </div>

                {/* Painel Principal correspondente à aba ativa */}
                <div className="panel-container">
                    <div className="panel-header">
                        <h2>
                            {activeTab === "noticias" && "Gerenciar Notícias"}
                            {activeTab === "galeria" && "Gerenciar Galeria"}
                            {activeTab === "equipe" && "Gerenciar Membros da Equipe"}
                        </h2>
                        <button className="btn-add" onClick={handleOpenAddModal}>
                            <FaPlus /> Adicionar Novo
                        </button>
                    </div>

                    {loadingData ? (
                        <div style={{ textAlign: "center", padding: "3rem", color: "#4A3B32" }}>
                            <h3>Buscando dados...</h3>
                        </div>
                    ) : (
                        <div className="data-table-container">
                            {/* Tabela de Notícias */}
                            {activeTab === "noticias" && (
                                noticias.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Imagem</th>
                                                <th>Título</th>
                                                <th>Data</th>
                                                <th>Resumo</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {noticias.map((n) => (
                                                <tr key={n.id}>
                                                    <td>
                                                        <img src={n.imagem} alt={n.titulo} className="thumbnail" />
                                                    </td>
                                                    <td style={{ fontWeight: "600" }}>{n.titulo}</td>
                                                    <td>{n.data}</td>
                                                    <td>{n.descricao.substring(0, 60)}...</td>
                                                    <td>
                                                        <div className="actions-cell">
                                                            <button className="btn-action btn-edit" onClick={() => handleOpenEditModal(n)} title="Editar">
                                                                <FiEdit />
                                                            </button>
                                                            <button className="btn-action btn-delete" onClick={() => handleDelete(n.id, n.imagem)} title="Excluir">
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-data">Nenhuma notícia cadastrada.</div>
                                )
                            )}

                            {/* Tabela da Galeria */}
                            {activeTab === "galeria" && (
                                galeria.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Imagem</th>
                                                <th>Título</th>
                                                <th>Categoria</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {galeria.map((g) => (
                                                <tr key={g.id}>
                                                    <td>
                                                        <img src={g.imagem} alt={g.titulo} className="thumbnail" />
                                                    </td>
                                                    <td style={{ fontWeight: "600" }}>{g.titulo}</td>
                                                    <td>{g.categoria}</td>
                                                    <td>
                                                        <div className="actions-cell">
                                                            <button className="btn-action btn-edit" onClick={() => handleOpenEditModal(g)} title="Editar">
                                                                <FiEdit />
                                                            </button>
                                                            <button className="btn-action btn-delete" onClick={() => handleDelete(g.id, g.imagem)} title="Excluir">
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-data">Nenhuma imagem na galeria.</div>
                                )
                            )}

                            {/* Tabela de Equipe */}
                            {activeTab === "equipe" && (
                                equipe.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Foto</th>
                                                <th>Nome</th>
                                                <th>Cargo</th>
                                                <th>E-mail</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {equipe.map((e) => (
                                                <tr key={e.id}>
                                                    <td>
                                                        <img src={e.foto} alt={e.nome} className="thumbnail" style={{ borderRadius: "50%", width: "45px", height: "45px" }} />
                                                    </td>
                                                    <td style={{ fontWeight: "600" }}>{e.nome}</td>
                                                    <td>{e.cargo}</td>
                                                    <td>{e.email}</td>
                                                    <td>
                                                        <div className="actions-cell">
                                                            <button className="btn-action btn-edit" onClick={() => handleOpenEditModal(e)} title="Editar">
                                                                <FiEdit />
                                                            </button>
                                                            <button className="btn-action btn-delete" onClick={() => handleDelete(e.id, e.foto)} title="Excluir">
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-data">Nenhum membro cadastrado.</div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL FORMULÁRIO (ADD / EDIT) */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>
                                {editingId ? "Editar " : "Cadastrar "}
                                {activeTab === "noticias" && "Notícia"}
                                {activeTab === "galeria" && "Imagem da Galeria"}
                                {activeTab === "equipe" && "Membro da Equipe"}
                            </h3>
                            <button className="btn-close" onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="admin-form">
                            {/* FORMULÁRIO NOTÍCIAS */}
                            {activeTab === "noticias" && (
                                <>
                                    <div className="form-group">
                                        <label>Título da Notícia</label>
                                        <input
                                            type="text"
                                            value={fieldTitulo}
                                            onChange={(e) => setFieldTitulo(e.target.value)}
                                            required
                                            placeholder="Ex: Novo plantio de araucárias..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Data</label>
                                        <input
                                            type="date"
                                            value={fieldData}
                                            onChange={(e) => setFieldData(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Conteúdo / Descrição</label>
                                        <textarea
                                            value={fieldDescricao}
                                            onChange={(e) => setFieldDescricao(e.target.value)}
                                            required
                                            rows={5}
                                            placeholder="Descreva o conteúdo detalhado da notícia..."
                                            style={{
                                                padding: "0.8rem 1rem",
                                                borderRadius: "8px",
                                                border: "1.5px solid rgba(74, 59, 50, 0.15)",
                                                fontFamily: "inherit",
                                                fontSize: "1rem"
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            {/* FORMULÁRIO GALERIA */}
                            {activeTab === "galeria" && (
                                <>
                                    <div className="form-group">
                                        <label>Título da Publicação</label>
                                        <input
                                            type="text"
                                            value={fieldTitulo}
                                            onChange={(e) => setFieldTitulo(e.target.value)}
                                            required
                                            placeholder="Ex: Workshop de Sementes"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Categoria</label>
                                        <select
                                            value={fieldCategoria}
                                            onChange={(e) => setFieldCategoria(e.target.value)}
                                            required
                                            style={{
                                                padding: "0.8rem 1rem",
                                                borderRadius: "8px",
                                                border: "1.5px solid rgba(74, 59, 50, 0.15)",
                                                fontSize: "1rem"
                                            }}
                                        >
                                            <option value="Educação">Educação</option>
                                            <option value="Ações de Extensão">Ações de Extensão</option>
                                            <option value="Pesquisa Científica">Pesquisa Científica</option>
                                            <option value="Conservação">Conservação</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* FORMULÁRIO EQUIPE */}
                            {activeTab === "equipe" && (
                                <>
                                    <div className="form-group">
                                        <label>Nome Completo</label>
                                        <input
                                            type="text"
                                            value={fieldNome}
                                            onChange={(e) => setFieldNome(e.target.value)}
                                            required
                                            placeholder="Ex: Prof. Dr. Carlos Silva"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Cargo / Função</label>
                                        <input
                                            type="text"
                                            value={fieldCargo}
                                            onChange={(e) => setFieldCargo(e.target.value)}
                                            required
                                            placeholder="Ex: Coordenador do Projeto"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>E-mail</label>
                                        <input
                                            type="email"
                                            value={fieldEmail}
                                            onChange={(e) => setFieldEmail(e.target.value)}
                                            required
                                            placeholder="Ex: carlos.silva@email.com"
                                        />
                                    </div>
                                </>
                            )}

                            {/* UPLOAD DE ARQUIVO (IMAGEM) - COMUM */}
                            <div className="form-group">
                                <label>Imagem / Foto</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFieldImagemFile(e.target.files[0]);
                                        }
                                    }}
                                    required={!editingId} // Obrigatório apenas na criação
                                    style={{ padding: "0.5rem 0" }}
                                />
                                {fieldImagemUrl && !fieldImagemFile && (
                                    <div>
                                        <span style={{ fontSize: "0.85rem", color: "#4A3B32" }}>Imagem atual:</span>
                                        <img src={fieldImagemUrl} alt="Atual" className="image-preview" />
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal} disabled={submitting}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-submit" disabled={submitting}>
                                    {submitting ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
