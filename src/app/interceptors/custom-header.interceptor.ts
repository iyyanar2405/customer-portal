import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@customer-portal/environments';

export const customHeaderInterceptor: HttpInterceptorFn = (req, next) => {
    const modifiedReq = req.clone({
        setHeaders: {
            'Ocp-Apim-Subscription-Key': environment.apimKey,
        },
        withCredentials: true,
    });
    return next(modifiedReq);
};