import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { IDraftRule } from 'src/shared/common/src/lib/interfaces';
import { PrivateCartableCustomerService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class PrivateCartableCustomerDraftResolver implements Resolve<IDraftRule[]> {
  constructor(private privateCartableCustomerService:PrivateCartableCustomerService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDraftRule[]> {
    return this.privateCartableCustomerService.getDraft();
  }
}
