import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, MaybeAsync } from '@angular/router';
import { Auth, authState, User } from '@angular/fire/auth';

import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
   auth = inject(Auth);

   user$ = authState(this.auth).pipe(
    filter(user=> user != null),
    map(user => user!) // Assert non-null user
  );


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<User> {
    return this.user$;
  }
}
