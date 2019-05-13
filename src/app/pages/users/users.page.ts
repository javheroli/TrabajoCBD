import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
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
  keyword: string;
  degreeFilter: string;
  courseFilter: string;

  constructor(
    public navCtrl: NavController,
    public dM: DataManagement,
    private cookieService: CookieService,
    public alertCtrl: AlertController,
    private translate: TranslateService,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
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
    this.listUsers(null, null, null);
  }

  ngOnInit() { }

  chat(otherUsername) {
    this.navCtrl.navigateForward(
      '/chat/' + this.logged.username + '/' + otherUsername
    );
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  private listUsers(degreeFilter: string, courseFilter: string, keyword: string): void {
    this.dM
      .listUsers(degreeFilter, courseFilter, keyword)
      .then((data: any) => {
        this.users = data;
      })
      .catch(error => { });
  }

  changeLanguage(selectedValue: { detail: { value: string } }) {
    this.cookieService.set('lang', selectedValue.detail.value);
    this.translate.use(selectedValue.detail.value);
  }

  searchUsers() {
    this.degreeFilter = null;
    this.courseFilter = null;
    this.listUsers(this.degreeFilter, this.courseFilter, this.keyword);
  }

  applyFilters() {
    this.keyword = null;
    this.listUsers(this.degreeFilter, this.courseFilter, this.keyword);
  }

  removeFilters() {
    this.degreeFilter = null;
    this.courseFilter = null;
    this.listUsers(this.degreeFilter, this.courseFilter, null);
  }


}
