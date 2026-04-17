import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { StatsService } from '../services/stats.service';

export const authGuard: CanActivateFn = () => {
  const statsService = inject(StatsService);
  const router = inject(Router);

  if (statsService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/');
};
