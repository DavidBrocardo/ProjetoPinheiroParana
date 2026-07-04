import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import {
    getNoticias,
    addNoticia,
    updateNoticia,
    deleteNoticia,
} from "../services/noticiasDAO";
import {
    getEquipe,
    addEquipe,
    updateEquipe,
    deleteEquipe,
} from "../services/equipesDAO";
import type { Noticia } from "../types/Noticia";
import type { equipe } from "../types/Equipe";
import {
    FaNewspaper,
    FaUsers,
    FaSignOutAlt,
    FaPlus,
    FaTree,
    FaTimes
} from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "../styles/admin.css";

type Tab = "noticias" | "equipe";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("noticias");

    // Estados dos dados
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [equipe, setEquipe] = useState<equipe[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // Estados dos Modais e Formulários
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Inputs do formulário (comuns a todas as entidades)
    const [fieldTitulo, setFieldTitulo] = useState("");
    const [fieldDescricao, setFieldDescricao] = useState("");
    // Futuramente, estas linhas podem ser reutilizadas para upload de imagens:
    // const [fieldImagemFile, setFieldImagemFile] = useState<File | null>(null);
    // const [fieldImagemUrl, setFieldImagemUrl] = useState("");
    const [fieldData, setFieldData] = useState("");
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
        // Futuramente, podem ser restaurados os campos de imagem:
        // setFieldImagemFile(null);
        // setFieldImagemUrl("");
        setFieldData(new Date().toISOString().split("T")[0]);
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
            // Futuramente, pode-se restaurar a imagem atual aqui:
            // setFieldImagemUrl(item.imagem);
        } else if (activeTab === "equipe") {
            setFieldNome(item.nome);
            setFieldCargo(item.cargo);
            setFieldEmail(item.email);
            // Futuramente, pode-se restaurar a foto atual aqui:
            // setFieldImagemUrl(item.foto);
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
            if (activeTab === "noticias") {
                const noticiaData = {
                    titulo: fieldTitulo,
                    descricao: fieldDescricao,
                    data: fieldData || new Date().toISOString().split("T")[0],
                    // Futuramente, pode-se incluir a imagem aqui quando houver suporte:
                    // imagem: fieldImagemUrl || ""
                };

                if (editingId) {
                    await updateNoticia(editingId, noticiaData);
                } else {
                    await addNoticia(noticiaData);
                }
            } else if (activeTab === "equipe") {
                const equipeData = {
                    nome: fieldNome,
                    cargo: fieldCargo,
                    email: fieldEmail,
                    // Futuramente, pode-se incluir a foto aqui quando houver suporte:
                    // foto: fieldImagemUrl || ""
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
    const handleDelete = async (id: string) => {
        if (!window.confirm("Deseja realmente excluir este item? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            if (activeTab === "noticias") {
                await deleteNoticia(id);
            } else if (activeTab === "equipe") {
                await deleteEquipe(id);
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
                    <h1>Projeto Pinheiro do Paraná — Painel de controle</h1>
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
                                                <th>Título</th>
                                                <th>Data</th>
                                                <th>Resumo</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {noticias.map((n) => (
                                                <tr key={n.id}>
                                                    {/* Futuramente, pode-se renderizar uma imagem aqui quando houver suporte. */}
                                                    <td style={{ fontWeight: "600" }}>{n.titulo}</td>
                                                    <td>{n.data}</td>
                                                    <td>{n.descricao}</td>
                                                    <td>
                                                        <div className="actions-cell">
                                                            <button className="btn-action btn-edit" onClick={() => handleOpenEditModal(n)} title="Editar">
                                                                <FiEdit />
                                                            </button>
                                                            <button className="btn-action btn-delete" onClick={() => handleDelete(n.id)} title="Excluir">
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

                            {/* Tabela de Equipe */}
                            {activeTab === "equipe" && (
                                equipe.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Cargo</th>
                                                <th>E-mail</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {equipe.map((e) => (
                                                <tr key={e.id}>
                                                    {/* Futuramente, pode-se renderizar uma foto aqui quando houver suporte. */}
                                                    <td style={{ fontWeight: "600" }}>{e.nome}</td>
                                                    <td>{e.cargo}</td>
                                                    <td>{e.email}</td>
                                                    <td>
                                                        <div className="actions-cell">
                                                            <button className="btn-action btn-edit" onClick={() => handleOpenEditModal(e)} title="Editar">
                                                                <FiEdit />
                                                            </button>
                                                            <button className="btn-action btn-delete" onClick={() => handleDelete(e.id)} title="Excluir">
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

                            {/* Futuramente, este bloco pode ser reativado para upload de imagens. */}
                            {/* <div className="form-group">
                                <label>Imagem / Foto</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFieldImagemFile(e.target.files[0]);
                                        }
                                    }}
                                    required={!editingId}
                                    style={{ padding: "0.5rem 0" }}
                                />
                                {fieldImagemUrl && !fieldImagemFile && (
                                    <div>
                                        <span style={{ fontSize: "0.85rem", color: "#4A3B32" }}>Imagem atual:</span>
                                        <img src={fieldImagemUrl} alt="Atual" className="image-preview" />
                                    </div>
                                )}
                            </div> */}

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
