export interface Usuario {
    uid: string;
    email: string;
    nome?: string;
    role: "admin" | "editor" | "user";
    ativo: boolean;
    dataCriacao: Date;
    dataAtualizacao?: Date;
}
