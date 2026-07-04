import { get, ref, push, set, update, remove } from "firebase/database";
import { rtdb } from "./firebase";
import type { Noticia } from "../types/Noticia";

// Futuramente, se o projeto tiver suporte para imagens, estas funções podem ser reutilizadas para upload no Firebase Storage.
// export const uploadImageNoticia = async (file: File): Promise<string> => {
//     if (!storage) {
//         throw new Error("Firebase Storage não inicializado. Verifique suas variáveis de ambiente.");
//     }
//     const fileRef = storageRef(storage, `noticias/${Date.now()}_${file.name}`);
//     await uploadBytes(fileRef, file);
//     return getDownloadURL(fileRef);
// };

// export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
//     if (!storage) return;
//     try {
//         const fileRef = storageRef(storage, imageUrl);
//         await deleteObject(fileRef);
//     } catch (error) {
//         console.error("Erro ao deletar imagem do storage:", error);
//     }
// };

/**
 * Busca todas as notícias ordenadas por data (mais recentes primeiro)
 */
export const getNoticias = async (): Promise<Noticia[]> => {
    if (!rtdb) {
        console.warn("Realtime Database não inicializado. Retornando dados vazios.");
        return [];
    }
    const noticiasRef = ref(rtdb, "noticias");
    const snapshot = await get(noticiasRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val() as Record<string, Omit<Noticia, "id">>;
    return Object.entries(data)
        .map(([id, noticia]) => ({ id, ...noticia } as Noticia))
        .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
};

/**
 * Busca uma notícia por ID
 */
export const getNoticiaById = async (id: string): Promise<Noticia | null> => {
    if (!rtdb) return null;
    const noticiaRef = ref(rtdb, `noticias/${id}`);
    const snapshot = await get(noticiaRef);

    if (!snapshot.exists()) return null;
    return { id, ...snapshot.val() } as Noticia;
};

/**
 * Criar nova notícia
 */
export const addNoticia = async (noticia: Omit<Noticia, "id">): Promise<string> => {
    if (!rtdb) throw new Error("Firebase Realtime Database não inicializado.");
    const noticiasRef = ref(rtdb, "noticias");
    const newRef = push(noticiasRef);
    await set(newRef, noticia);
    return newRef.key ?? "";
};

/**
 * Atualizar notícia existente
 */
export const updateNoticia = async (
    id: string,
    noticia: Partial<Omit<Noticia, "id">>
): Promise<void> => {
    if (!rtdb) throw new Error("Firebase Realtime Database não inicializado.");
    const noticiaRef = ref(rtdb, `noticias/${id}`);
    await update(noticiaRef, noticia);
};

/**
 * Deletar notícia (e sua imagem associada)
 */
export const deleteNoticia = async (id: string): Promise<void> => {
    if (!rtdb) throw new Error("Firebase Realtime Database não inicializado.");
    const noticiaRef = ref(rtdb, `noticias/${id}`);
    await remove(noticiaRef);
};
