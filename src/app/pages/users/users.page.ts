import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController
} from '@ionic/angular';
import { User } from '../../app.data.model';
import { DataManagement } from '../../services/dataManagement';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss']
})
export class UsersPage implements OnInit {
  users: User[] = [];
  logged: User;

  constructor(
    public navCtrl: NavController,
    public dM: DataManagement,
    private cookieService: CookieService,
    public alertCtrl: AlertController,
    private translate: TranslateService,
    public loadingCtrl: LoadingController
  ) {
    const token = this.cookieService.get('token');
    this.dM
      .getUserLogged(token)
      .then(res => {
        this.logged = res;
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
    this.listUsers();
  }

  ngOnInit() {}

  chat(otherUsername) {
    this.navCtrl.navigateForward(
      '/chat/' + this.logged.username + '/' + otherUsername
    );
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  private listUsers(): void {
    this.dM
      .listUsers()
      .then((data: any) => {
        this.users = data;
      })
      .catch(error => {});
  }
}
