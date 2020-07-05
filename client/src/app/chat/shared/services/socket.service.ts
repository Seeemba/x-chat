/**
 * X-Chat Client.
 * Socket Service
 * @author Serhiy Posokhin
 * @version 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as socketIo from 'socket.io-client';
import { environment } from '../../../../environments/environment';

import { Event } from '../model/event';
import { Message } from '../model/message';
import { User } from '../model/user';

const SERVER_URL = environment.apiUrl || 'http://localhost:3001';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }
  public send(message: Message): void {
    this.socket.emit('message', message);
  }
  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }
  public onUsers(): Observable<User> {
    return new Observable<User>(observer => {
      this.socket.on('users', (data: any) => {
        observer.next(data);
      });
    });
  }
  public onEvent(event: Event, user: User): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on('connect', () => {
        user.socketId = this.socket.id;
        this.socket.emit('new-user', user);
        observer.next();
      });
    });
  }
}
