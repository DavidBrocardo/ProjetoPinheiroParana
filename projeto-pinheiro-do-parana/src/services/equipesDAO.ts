import { get, ref, push, set, update, remove } from "firebase/database";
import { rtdb } from "./firebase";
import type { equipe } from "../types/Equipe";

// Futuramente, se o projeto tiver suporte para imagens, estas funções podem ser reutilizadas para upload no Firebase Storage.
// export const uploadImageEquipe = async (file: File): Promise<string> => {
//     if (!storage) {
//         throw new Error("Firebase Storage não inicializado. Verifique suas variáveis de ambiente.");
//     }
//     const fileRef = storageRef(storage, `equipe/${Date.now()}_${file.name}`);
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
 * Busca todos os membros da equipe
 */
export const getEquipe = async (): Promise<equipe[]> => {
  if (!rtdb) return [];

  for (const path of ["equipe", "Equipe"]) {
    const snapshot = await get(ref(rtdb, path));

    if (snapshot.exists()) {
      const data = snapshot.val() as Record<string, Omit<equipe, "id">>;
      return Object.entries(data).map(([id, membro]) => ({ id, ...membro } as equipe));
    }
  }

  return [];
};
/**
 * Busca um membro da equipe por ID
 */
export const getEquipeById = async (id: string): Promise<equipe | null> => {
    if (!rtdb) return null;
    const membroRef = ref(rtdb, `equipe/${id}`);
    const snapshot = await get(membroRef);

    if (!snapshot.exists()) return null;
    return { id, ...snapshot.val() } as equipe;
};

/**
 * Criar novo membro da equipe
 */
export const addEquipe = async (membro: Omit<equipe, "id">): Promise<string> => {
    if (!rtdb) throw new Error("Firebase Realtime Database não inicializado.");
    const equipeRef = ref(rtdb, "equipe");
    const newRef = push(equipeRef);
    await set(newRef, membro);
    return newRef.key ?? "";
};

/**
 * Atualizar membro da equipe existente
 */
export const updateEquipe = async (
    id: string,
    membro: Partial<Omit<equipe, "id">>
): Promise<void> => {
    if (!rtdb) throw new Error("Firebase Realtime Database não inicializado.");
    const membroRef = ref(rtdb, `equipe/${id}`);
    await update(membroRef, membro);
};

/**
 * Deletar membro da equipe (e sua foto associada)
 */
export const deleteEquipe = async (id: string): Promise<void> => {
    if (!rtdb) throw new Error("Firebase Realtime Database não inicializado.");
    const membroRef = ref(rtdb, `equipe/${id}`);
    await remove(membroRef);
};
