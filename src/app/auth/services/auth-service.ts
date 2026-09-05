import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";



@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient)

    login(datos: { email: string; contrasena: string }) {
        return this.http.post('http://localhost:8080/usuarios/auth', datos);
    }

    registrar(datos: {
        nombre: string; 
        apellido: string; 
        email: string; 
        contrasena: string;
    }) {
        return this.http.post('http://localhost:8080/usuarios/registro', datos);
    }
}