import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

export interface AuthResponseData{
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{

  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  /** returns a boolean overall with a information whether 
  the user is authenticated or not*/
  get userIsAuthenticated(){
    return this._user.asObservable().pipe(
      map(user => {
        // !! converts data to a boolean 
        if(user){
          return !!user.token;
        }
        else{
          return false;
        }
      })
    );
  }

  get userId(){
    return this._user.asObservable().pipe(
      map( user => {
        if(user){
          return user.id;
        }
        else{
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient) { }

  /** method for retrieve data from the Capacitor Native Storage
    --from is creational operator from rxjs library 
      used for casting the promise (in this case) to a observable */
  autoLogin(){
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(storedData => {
        // returns null if we don't have any data
        if(!storedData || !storedData.value){
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string; 
          tokenExpirationDate: string; 
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        // returns null if the token has expired
        if(expirationTime <= new Date()){
          return null;
        }
        const user = new User(
          parsedData.userId, 
          parsedData.email, 
          parsedData.token, 
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if(user){
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    )
  }

  signUp(email: string, password: string){
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
        environment.firebaseAPIKey
      }`, {email: email, password: password, returnSecureToken: true}
    ).pipe(
      tap(this.setUserData.bind(this))
    );
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
        environment.firebaseAPIKey
      }`, {email: email, password: password, returnSecureToken: true}
    ).pipe(
      tap(this.setUserData.bind(this))
    );
  }

  logout(){
    if(this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});
  }

  private autoLogout(duration: number){
    if(this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  ngOnDestroy(){
    if(this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private setUserData(userData: AuthResponseData){
    /** conversion the expiresIn property, that gives seconds till the token expires,
        to Date object that will gives exact time till the token expires*/
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(
      userData.localId, 
      userData.email, 
      userData.idToken, 
      expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    // toISOString can be used with a Date constructor
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email)  
  }

  // method for storing data in Capacitor Native Storage
  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string){
    const data = JSON.stringify({
      userId: userId, 
      token: token, 
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Plugins.Storage.set({key: 'authData', value: data});
  }
}
