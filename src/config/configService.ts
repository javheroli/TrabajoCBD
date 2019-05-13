import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigService {
  constructor() {}

  public config() {
    let urlPrefix = 'http://192.168.1.135:5000/';
    let urlPrefixLocalhost = 'http://localhost:5000/';
    let urlAPI = '';
    if (environment.production) {
      urlPrefix = 'https://chat-trabajo-CBD.herokuapp.com/';
      urlPrefixLocalhost = 'https://chat-trabajo-CBD.herokuapp.com/';
      urlAPI = '';
    }

    return {
      restUrlPrefix: urlPrefix + urlAPI,
      restUrlPrefixLocalhost: urlPrefixLocalhost + urlAPI
    };
  }
}
