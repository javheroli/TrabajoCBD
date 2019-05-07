import {} from './../app.data.model';
import { Injectable } from '@angular/core';
import { RestWS } from './restService';

@Injectable()
export class DataManagement {
  constructor(private restService: RestWS) {}

  public turnOnServer() {
    this.restService.turnOnServer();
  }

  public login(credentials): Promise<any> {
    return this.restService
      .login(credentials)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  public getUserLogged(token): Promise<any> {
    return this.restService
      .getUserLogged(token)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public listUsers(): Promise<any> {
    return this.restService
      .listUsers()
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public register(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    degree: string,
    course: string,
    profilePic
  ): Promise<any> {
    return this.restService
      .register(
        username,
        password,
        firstName,
        lastName,
        degree,
        course,
        profilePic
      )
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }
}
