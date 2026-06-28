import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import type { Noticia } from "../types/Noticia";
import type { Galeria } from "../types/Galeria";
import type { Equipe } from "../types/Equipe";

// ==========================================
// UPLOAD DE IMAGEM
// ==========================================
export const uploadImage = async (file: File, folder: string): Promise<string> => {
    if (!storage) {
        throw new Error("Firebase Storage não inicializado. Verifique suas variáveis de ambiente.");
    }
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
};

export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
    if (!storage) return;
    try {
        const fileRef = ref(storage, imageUrl);
        await deleteObject(fileRef);
    } catch (error) {
        console.error("Erro ao deletar imagem do storage:", error);
    }
};

// ==========================================
// NOTICIAS CRUD
// ==========================================
export const getNoticias = async (): Promise<Noticia[]> => {
    if (!db) {
        console.warn("Firestore não inicializado. Retornando dados vazios.");
        return [];
    }
    const noticiasCol = collection(db, "noticias");
    const q = query(noticiasCol, orderBy("data", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Noticia[];
};

export const addNoticia = async (noticia: Omit<Noticia, "id">): Promise<string> => {
    if (!db) throw new Error("Firebase Firestore não inicializado.");
    const noticiasCol = collection(db, "noticias");
    const docRef = await addDoc(noticiasCol, noticia);
    return docRef.id;
};

export const updateNoticia = async (id: string, noticia: Partial<Omit<Noticia, "id">>): Promise<void> => {
    if (!db) throw new Error("Firebase Firestore não inicializado.");
    const docRef = doc(db, "noticias", id);
    await updateDoc(docRef, noticia);
};

export const deleteNoticia = async (id: string, imageUrl?: string): Promise<void> => {
    if (!db) throw new Error("Firebase Firestore não inicializado.");
    if (imageUrl) {
        await deleteImageFromStorage(imageUrl);
    }
    const docRef = doc(db, "noticias", id);
    await deleteDoc(docRef);
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

// ==========================================
// EQUIPE CRUD
// ==========================================
export const getEquipe = async (): Promise<Equipe[]> => {
    if (!db) {
        console.warn("Firestore não inicializado. Retornando dados vazios.");
        return [];
    }
    const equipeCol = collection(db, "equipe");
    const snapshot = await getDocs(equipeCol);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Equipe[];
};

export const addEquipe = async (membro: Omit<Equipe, "id">): Promise<string> => {
    if (!db) throw new Error("Firebase Firestore não inicializado.");
    const equipeCol = collection(db, "equipe");
    const docRef = await addDoc(equipeCol, membro);
    return docRef.id;
};

export const updateEquipe = async (id: string, membro: Partial<Omit<Equipe, "id">>): Promise<void> => {
    if (!db) throw new Error("Firebase Firestore não inicializado.");
    const docRef = doc(db, "equipe", id);
    await updateDoc(docRef, membro);
};

export const deleteEquipe = async (id: string, imageUrl?: string): Promise<void> => {
    if (!db) throw new Error("Firebase Firestore não inicializado.");
    if (imageUrl) {
        await deleteImageFromStorage(imageUrl);
    }
    const docRef = doc(db, "equipe", id);
    await deleteDoc(docRef);
};
