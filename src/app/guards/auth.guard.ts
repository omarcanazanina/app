import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth'
import {map} from 'rxjs/operators'
import { isNullOrUndefined } from 'util';
import {Router} from  '@angular/router'
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private fauth:AngularFireAuth, private route:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):Observable<boolean> | Promise<boolean> |boolean{
    
      return  this.fauth.authState.pipe(map(auth =>{
        if(isNullOrUndefined(auth)){
          this.route.navigate(['/index'])
          return false
        }else{
          return true
        }
        //console.log(auth);
        //return false;
      }))
      
    }
}
