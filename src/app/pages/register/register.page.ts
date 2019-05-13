import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  EmailValidator
} from '@angular/forms';
import {
  NavController,
  MenuController,
  LoadingController,
  AlertController,
  Events
} from '@ionic/angular';
import { User } from 'src/app/app.data.model';
import { DataManagement } from 'src/app/services/dataManagement';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  degree: string;
  course: string;
  profilePic: File = null;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public dm: DataManagement,
    private translate: TranslateService,
    private cookieService: CookieService,
    public alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    public events: Events
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      confirmPassword: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      degree: [null, Validators.compose([Validators.required])],
      course: [null, Validators.compose([Validators.required])]
    });
  }

  confirmPasswordValidation() {
    if (this.password === this.confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

  public signUp() {
    let translation1: string = this.translate.instant(
      'REGISTER.HEADER_SUCCESS'
    );
    let translation2: string = this.translate.instant('REGISTER.SUCCESS');
    let translation3: string = this.translate.instant(
      'REGISTER.ERROR_USERNAME'
    );

    this.dm
      .register(
        this.username,
        this.password,
        this.firstName,
        this.lastName,
        this.degree,
        this.course,
        this.profilePic
      )
      .then(data => {
        this.showLoading();
        setTimeout(() => {
          this.alertCtrl
            .create({
              header: translation1,
              message: translation2,
              buttons: [
                {
                  text: 'Ok',
                  role: 'ok'
                }
              ]
            })
            .then(alertEl => {
              alertEl.present();
            });
          this.navCtrl.navigateForward('/');
          (this.username = ''),
            (this.password = ''),
            (this.confirmPassword = ''),
            (this.firstName = ''),
            (this.lastName = ''),
            (this.degree = ''),
            (this.course = ''),
            (this.profilePic = null);
        }, 1500);
      })
      .catch(error => {
        this.showLoading();
        setTimeout(() => {
          this.alertCtrl
            .create({
              header: 'Error',
              message: translation3,
              buttons: [
                {
                  text: 'Ok',
                  role: 'ok'
                }
              ]
            })
            .then(alertEl => {
              alertEl.present();
            });
        }, 1500);
      });
  }

  showLoading() {
    const translation2: string = this.translate.instant('LOGIN.WAIT');
    this.loadingCtrl
      .create({
        message: translation2,
        showBackdrop: true,
        duration: 1000
      })
      .then(loadingEl => {
        loadingEl.present();
      });
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }

  onProfilePicInputChange(file: File) {
    this.checkFileIsImage(file[0], 'profPic');
    this.profilePic = file[0];
  }

  private checkFileIsImage(file: File, picture: string) {
    if (!(file.type.split('/')[0] == 'image')) {
      let translation1: string = this.translate.instant('REGISTER.IMAGE_ERROR');

      this.alertCtrl
        .create({
          header: translation1,
          buttons: [
            {
              text: 'Ok',
              role: 'ok'
            }
          ]
        })
        .then(alertEl => {
          alertEl.present();
        });

      if (picture == 'profPic') {
        this.profilePic = null;
        // Aunque de fallo de compilación, funciona
        (<HTMLInputElement>document.getElementById('procPic')).value = '';
      }
    }
  }

  changeLanguage(selectedValue: { detail: { value: string } }) {
    this.cookieService.set('lang', selectedValue.detail.value);
    this.translate.use(selectedValue.detail.value);
  }
}
