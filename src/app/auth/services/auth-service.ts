import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UsuarioResponse } from "../interfaces/usuario-response";
import { environment } from "../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient)

    login(datos: { email: string; contrasena: string }) {
        return this.http.post<UsuarioResponse>(`${environment.apiUrl}/usuarios/auth`, datos);
    }

    registrar(datos: {
        nombre: string; 
        apellido: string; 
        email: string; 
        contrasena: string;
    }) {
        return this.http.post(`${environment.apiUrl}/usuarios/registro`, datos);
    }

    recuperarContrasena(email: string) {
        return this.http.post(
            `${environment.apiUrl}/usuarios/recuperar-contrasena`, 
            { email }, 
            { responseType: 'text'}
        );
    }

    restablecerContrasena(token: string, nuevaContrasena: string) {
        return this.http.patch(
            `${environment.apiUrl}/usuarios/restablecer-contrasena`, 
            {
                token,
                nuevaContrasena
            },
            {
                responseType: 'text'
            }
            
        );
    }

    
}