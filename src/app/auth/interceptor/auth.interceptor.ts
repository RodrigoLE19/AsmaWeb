import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { catchError, throwError } from "rxjs";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const dialog = inject(MatDialog);

    const apiUrl = environment.apiUrl.replace(/\/+$/, '');

    const esPeticionApi = req.url === apiUrl || req.url.startsWith(`${apiUrl}/`);

    const esRutaPublica = [
        '/usuarios/auth',
        '/usuarios/registro',
        '/usuarios/recuperar-contrasena',
        '/usuarios/restablecer-contrasena'
    ].some(ruta => req.url.split('?')[0] === `${apiUrl}${ruta}`);

    if (!esPeticionApi || esRutaPublica) {
        return next(req);
    }

    const token = localStorage.getItem('token');

    const peticion = token
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : req;

    return next(peticion).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                const tokenActual = localStorage.getItem('token');

                if (tokenActual === token) {
                    localStorage.removeItem('token');
                    dialog.closeAll();

                    void router.navigate(['/login'], {
                        replaceUrl: true
                    });
                }
                
            }

            return throwError(() => error);
        })
    )
}