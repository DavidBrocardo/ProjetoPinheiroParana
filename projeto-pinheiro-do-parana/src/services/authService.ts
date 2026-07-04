import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "./firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp,
} from "firebase/firestore";
import type { Usuario } from "../types/Usuario";

export const login = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const logout = async (): Promise<void> => {
    await signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * Busca o perfil do usuário no Firestore
 */
export const getUserProfile = async (uid: string): Promise<Usuario | null> => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data,
                dataCriacao: data.dataCriacao?.toDate() || new Date(),
                dataAtualizacao: data.dataAtualizacao?.toDate(),
            } as Usuario;
        }
        return null;
    } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        return null;
    }
};

/**
 * Cria um novo perfil de usuário no Firestore
 */
export const createUserProfile = async (
    uid: string,
    email: string,
    nome?: string,
    role: "admin" | "editor" | "user" = "user"
): Promise<void> => {
    try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
            uid,
            email,
            nome: nome || email.split("@")[0],
            role,
            ativo: true,
            dataCriacao: Timestamp.now(),
            dataAtualizacao: Timestamp.now(),
        });
    } catch (error) {
        console.error("Erro ao criar perfil do usuário:", error);
        throw error;
    }
};

/**
 * Atualiza o perfil do usuário no Firestore
 */
export const updateUserProfile = async (
    uid: string,
    updates: Partial<Usuario>
): Promise<void> => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            ...updates,
            dataAtualizacao: Timestamp.now(),
        });
    } catch (error) {
        console.error("Erro ao atualizar perfil do usuário:", error);
        throw error;
    }
};
