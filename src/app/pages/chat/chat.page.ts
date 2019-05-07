import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataManagement } from 'src/app/services/dataManagement';
import { interval } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/app.data.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {
  loggedUsername: string;
  otherUsername: string;
  other: User = null;
  logged: User = null;
  message: string;
  messages: any;
  private mutationObserver: MutationObserver;

  @ViewChild('content') content;
  @ViewChild('chatlist', { read: ElementRef }) chatList: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dm: DataManagement,
    private cookieService: CookieService
  ) {}
  public intervallTimer = interval(1000);
  private subscription;

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.loggedUsername = paramMap.get('loggedUsername');
      this.otherUsername = paramMap.get('otherUsername');
    });
    const token = this.cookieService.get('token');

    this.logged = await this.dm.getUserLogged(token);
    this.other = await this.dm.getUserByUsername(this.otherUsername, token);
    console.log(this.other);

    this.messages = await this.dm.getMessages(
      this.logged.username,
      this.other.username
    );

    this.subscription = this.intervallTimer.subscribe(x => {
      this.getMessages();
    });
  }

  ionViewDidEnter() {
    this.content.scrollToBottom(300);
    this.mutationObserver = new MutationObserver(mutations => {
      this.content.scrollToBottom(300);
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true,
      attributes: true,
      subtree: true
    });
  }

  keypress($event) {
    if ($event.keyCode == 13) {
      this.sendMessage();
    }
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      console.log(event);
    }
  }

  stopInterval() {
    this.subscription.unsubscribe();
  }

  async sendMessage() {
    const message = await this.dm.sendMessage(
      this.logged.username,
      this.other.username,
      this.message
    );
    this.message = '';
  }

  async getMessages() {
    const messages: any = await this.dm.getMessages(
      this.logged.username,
      this.other.username
    );

    const changed = await this.hasChanges(messages, this.messages);

    if (changed) {
      const indexNew = messages.length;
      let indexOld = this.messages.length;

      for (indexOld; indexOld < indexNew; indexOld++) {
        await this.messages.push(messages[indexOld]);
      }
    }
  }

  async hasChanges(newMessages: any, oldMessages: any) {
    if (newMessages.length === oldMessages.length) {
      return false;
    }
    return true;
  }
}
