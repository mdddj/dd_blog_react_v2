export interface TextModel {
    id?: number;
    name: string;
    context: string;
    intro?: string;
    isEncryptionText?: boolean;
    viewPassword?: string;
}
