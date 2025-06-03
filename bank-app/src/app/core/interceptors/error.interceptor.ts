import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ERROR_MESSAGES } from '../../shared/constants/error.constants';
import { ErrorModalService } from '../../shared/services/error-modal.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorModalService = inject(ErrorModalService);
  return next(req).pipe(
    catchError(error => {
      let message = 'Ocurrió un error inesperado.';
      const errorMessage = ERROR_MESSAGES[Number(error.status) as keyof typeof ERROR_MESSAGES] || message;
      errorModalService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};