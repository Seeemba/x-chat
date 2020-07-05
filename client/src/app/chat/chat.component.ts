/**
 * X-Chat Client.
 * Chat component
 * @author Serhiy Posokhin
 * @version 1.0.0
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  ViewChild,
  AfterViewInit,
  QueryList,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatList, MatListItem } from '@angular/material/list';
import { MediaMatcher } from '@angular/cdk/layout';

import { Action } from './shared/model/action';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogUserType } from './dialog-user/dialog-user-type';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { SocketService } from './shared/services/socket.service';
import { User } from './shared/model/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  action = Action;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome to X-Chat!',
      dialogType: DialogUserType.NEW
    }
  };
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  ioConnection: any;
  messageContent: string;
  messages: Message[] = [];
  mobileQuery: MediaQueryList;
  mobileQueryListener: () => void;
  user: User;
  users: User[] = [];

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild('chatList', { read: ElementRef, static: true }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  constructor(
    private socketService: SocketService,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.initModel();
    this.openUserPopup(this.defaultDialogUserParams);
  }

  ngAfterViewInit(): void {
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  private initModel(): void {
    this.user = {};
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.socketService.onEvent(Event.CONNECT, this.user).subscribe();

    this.socketService.onEvent(Event.DISCONNECT, this.user).subscribe();

    this.socketService.onUsers()
      .subscribe((users: any) => {
        this.users = users;
      });
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      this.user.nickname = paramsDialog.nickname;
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      }
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.user,
      content: message
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action
      };
    }

    this.socketService.send(message);
  }

  addNickname(nickname: string) {
    if (this.messageContent) {
      this.messageContent += ' @' + nickname + ' ';
    } else {
      this.messageContent = '@' + nickname + ' ';
    }
  }
}
