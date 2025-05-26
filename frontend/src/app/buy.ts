import { Usuario } from "./usuario";

export class Buy {
    date!: string;
    hour!: string;        // ⚠️ AÑADE este campo
    dinner!: boolean;
    lunch!: boolean;
    monthly!: boolean;
    user!: { id: number }; // ajusta el tipo a lo que el backend espera
    combo!: { id: number }; // ⚠️ AÑADE este campo
}

