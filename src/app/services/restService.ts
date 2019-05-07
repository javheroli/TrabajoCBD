import { HttpClient } from '@angular/common/http';
import { ConfigService } from './../../config/configService';
import { AbstractWS } from './abstractService';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class RestWS extends AbstractWS {
  path = '';

  constructor(
    private config: ConfigService,
    http: HttpClient,
    private cookieService: CookieService
  ) {
    super(http);
    // this.path = this.config.config().restUrlPrefix;
    this.path = this.config.config().restUrlPrefixLocalhost;
  }
  // Methods
  public turnOnServer() {
    this.makeGetRequest(this.path + 'api/turnOnServer/', null);
  }

  public login(credentials) {
    const fd = new FormData();
    fd.append('username', credentials.username);
    fd.append('password', credentials.password);
    return this.makePostRequest(this.path + 'api/auth/login/', fd)
      .then(res => {
        console.log('Logged successfully');
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public getUserLogged(token) {
    return this.makeGetRequest(this.path + 'api/getUserLogged/', null, token)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }
  public listUsers() {
    const token = this.cookieService.get('token');
    return this.makeGetRequest(this.path + 'api/users/', null, token)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
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
  ) {
    const fd = new FormData();
    fd.append('username', username);
    fd.append('password', password);
    fd.append('firstName', firstName);
    fd.append('lastName', lastName);
    fd.append('degree', degree);
    fd.append('course', course);
    if (profilePic !== null) {
      console.log(profilePic);
      fd.append('image', profilePic);
    }

    return this.makePostRequest(this.path + 'api/auth/signup/', fd)
      .then(res => {
        console.log('Sign up successfully');
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public getMessages(sender: string, receiver: string) {
    let token: string;
    token = this.cookieService.get('token');

    return this.makeGetRequest(
      this.path + 'api/messages/' + sender + '/' + receiver + '/',
      false,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public sendMessage(sender: string, receiver: string, message: string) {
    const fd = new FormData();
    let token: string;
    token = this.cookieService.get('token');
    fd.append('sender', sender);
    fd.append('receiver', receiver);
    fd.append('message', message);

    return this.makePostRequest(this.path + 'api/messages/', fd, token)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(error => {
        console.log('Error: ' + error);
        return Promise.reject(error);
      });
  }

  public getUserByUsername(username, token) {
    return this.makeGetRequest(
      this.path + 'api/users/' + username + '/',
      null,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }

  public deleteMessages(messageId) {
    let token: string;
    token = this.cookieService.get('token');
    return this.makeDeleteRequest(
      this.path + 'api/deleteMessages/' + messageId,
      token
    )
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log('Error: ' + err);
        return Promise.reject(err);
      });
  }
}
