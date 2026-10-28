import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { UsuarioResponse } from "../interfaces/usuario-response";
import { environment } from "../../environments/environment";
import { tap } from 'rxjs';

export interface PerfilUsuario {
    idUsuario: number;
    nombre: string;
    apellido: string;
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient)

    private readonly perfilActual = signal<PerfilUsuario | null>(null);

    readonly perfil = this.perfilActual.asReadonly();

    guardarSesion(respuesta: UsuarioResponse): void {
        localStorage.removeItem('usuario');
        localStorage.setItem('token', respuesta.token);

        this.perfilActual.set({
            idUsuario: respuesta.idUsuario,
            nombre: respuesta.nombre,
            apellido: respuesta.apellido,
            email: respuesta.email
        });
    }

    cerrarSesion(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.perfilActual.set(null);
    }

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

    obtenerPerfil() {
        const tokenSolicitado = localStorage.getItem('token');

        return this.http.get<PerfilUsuario>(`${environment.apiUrl}/usuarios/me`)
        .pipe(
            tap(perfil => {
                if (localStorage.getItem('token') === tokenSolicitado) {
                    this.perfilActual.set(perfil);
                }
            })
        );
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