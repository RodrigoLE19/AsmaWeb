import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    
    try {
        const token = localStorage.getItem('token');

        if (typeof token === 'string') {
            const partes = token.split('.');

            if (partes.length === 3) {
                const payloadBase64 = partes[1]
                    .replace(/-/g, '+')
                    .replace(/_/g, '/');

                const payload = JSON.parse(
                    atob(payloadBase64.padEnd(
                        Math.ceil(payloadBase64.length / 4) * 4,
                        '='
                    ))
                );

                if (
                    typeof payload.exp === 'number' &&
                    Number.isFinite(payload.exp) &&
                    payload.exp * 1000 > Date.now()
                ) {
                    return true;
                }
            }
        }
    } catch {
        
    }

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    return router.createUrlTree(['/login']);
}