import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ERROR_MESSAGES_BY_STATUS } from '../../shared/constants/error.constants';
import { ErrorModalService } from '../../shared/services/error-modal.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorModalService = inject(ErrorModalService);
  return next(req).pipe(
    catchError(error => {
      let message = 'Ocurrió un error inesperado.';
      const errorMessage = ERROR_MESSAGES_BY_STATUS[Number(error.status) as keyof typeof ERROR_MESSAGES_BY_STATUS] || message;
      errorModalService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};