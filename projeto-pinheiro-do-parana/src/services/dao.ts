import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { get, ref, push, set, update, remove } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, rtdb } from "./firebase";
import type { Noticia } from "../types/Noticia";
import type { Galeria } from "../types/Galeria";

// ==========================================
// UPLOAD DE IMAGEM
// ==========================================
export const uploadImage = async (file: File, folder: string): Promise<string> => {
    if (!storage) {
        throw new Error("Firebase Storage não inicializado. Verifique suas variáveis de ambiente.");
    }
    const fileRef = storageRef(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
};

export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
    if (!storage) return;
    try {
        const fileRef = storageRef(storage, imageUrl);
        await deleteObject(fileRef);
    } catch (error) {
        console.error("Erro ao deletar imagem do storage:", error);
    }
};

// ==========================================
// NOTICIAS CRUD
// ==========================================
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

export const addNoticia = async (noticia: Omit<Noticia, "id">): Promise<string> => {
    if (!rtdb) throw new Error("Firebase Realtime Database não inicializado.");
    const noticiasRef = ref(rtdb, "noticias");
    const newRef = push(noticiasRef);
    await set(newRef, noticia);
    return newRef.key ?? "";
};

export const updateNoticia = async (id: string, noticia: Partial<Omit<Noticia, "id">>): Promise<void> => {
    if (!rtdb) throw new Error("Firebase Realtime Database não inicializado.");
    const noticiaRef = ref(rtdb, `noticias/${id}`);
    await update(noticiaRef, noticia);
};

export const deleteNoticia = async (id: string, imageUrl?: string): Promise<void> => {
    if (!rtdb) throw new Error("Firebase Realtime Database não inicializado.");
    if (imageUrl) {
        await deleteImageFromStorage(imageUrl);
    }
    const noticiaRef = ref(rtdb, `noticias/${id}`);
    await remove(noticiaRef);
};

// ==========================================
// GALERIA CRUD
// ==========================================
export const getGaleria = async (): Promise<Galeria[]> => {
    if (!db) {
        console.warn("Firestore não inicializado. Retornando dados vazios.");
        return [];
    }
    const galeriaCol = collection(db, "galeria");
    const snapshot = await getDocs(galeriaCol);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Galeria[];
};

export const addGaleria = async (galeria: Omit<Galeria, "id">): Promise<string> => {
    if (!db) throw new Error("Firebase Firestore não inicializado.");
    const galeriaCol = collection(db, "galeria");
    const docRef = await addDoc(galeriaCol, galeria);
    return docRef.id;
};

export const updateGaleria = async (id: string, galeria: Partial<Omit<Galeria, "id">>): Promise<void> => {
    if (!db) throw new Error("Firebase Firestore não inicializado.");
    const docRef = doc(db, "galeria", id);
    await updateDoc(docRef, galeria);
};

export const deleteGaleria = async (id: string, imageUrl?: string): Promise<void> => {
    if (!db) throw new Error("Firebase Firestore não inicializado.");
    if (imageUrl) {
        await deleteImageFromStorage(imageUrl);
    }
    const docRef = doc(db, "galeria", id);
    await deleteDoc(docRef);
};

