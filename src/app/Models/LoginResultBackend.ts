// Arquivo: src/app/Models/LoginResultBackend.ts
import { UserDataModel } from "./UserData.Model";

export interface LoginResultBackend {
  jwt?: string;
  validade?: Date;
  usuario?: UserDataModel;
  codErro?: number;
  mensagem?: string;
}
