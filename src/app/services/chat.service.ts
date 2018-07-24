 // src/app/services/chat.service.ts
 import { Injectable } from '@angular/core';
 import { PusherService } from './pusher.service';
 import { HttpClient } from '@angular/common/http';
 import { Observable } from 'rxjs';
 import {tap} from 'rxjs/operators';
 import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  user: {displayName: string, email: string};
  private _endPoint = environment.url;
  private _channel: any;

  constructor(private _pusherService: PusherService, private _http: HttpClient) {
    this._channel = this._pusherService.getPusher().subscribe('chat-group');
  }

  join(param): Observable<any> {
    return this._http.post(`${this._endPoint}/join`, param)
    .pipe(tap(() => {
      this.user = param;
    }));
  }

  sendMessage(message: string): Observable<any> {
    const param = {
      message,
      userType: 'human',
      messageType: 'text',
      ...this.user
    };
    return this._http.post(`${this._endPoint}/message`, param);
  }

  getChannel() {
    return this._channel;
  }
}
