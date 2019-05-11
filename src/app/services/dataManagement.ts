import { } from './../app.data.model';
import { Injectable } from '@angular/core';
import { RestWS } from './restService';

@Injectable()
export class DataManagement {
  constructor(private restService: RestWS) { }

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
  public listUsers(degreeFilter: string, courseFilter: string, keyword: string): Promise<any> {
    return this.restService
      .listUsers(degreeFilter, courseFilter, keyword)
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

  public getMessages(sender: string, receiver: string): Promise<any> {
    return this.restService
      .getMessages(sender, receiver)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  public sendMessage(
    sender: string,
    receiver: string,
    message: string
  ): Promise<any> {
    return this.restService
      .sendMessage(sender, receiver, message)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject('error');
      });
  }

  public getUserByUsername(username, token): Promise<any> {
    return this.restService
      .getUserByUsername(username, token)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public deleteMessages(messageId): Promise<any> {
    return this.restService
      .deleteMessages(messageId)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public editMessages(message): Promise<any> {
    return this.restService
      .editMessages(message)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
