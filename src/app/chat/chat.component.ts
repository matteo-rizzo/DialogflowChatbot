// src/app/chat/chat.component.ts

import { Component, OnInit } from '@angular/core';
import { IChat } from '../interfaces/ichat';
import { ChatService } from '../services/chat.service';
import { trigger, style, transition, animate, group } from '@angular/animations';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
  trigger('itemAnim', [
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate(350)
    ]),
    transition(':leave', [
      group([
        animate('0.2s ease', style({
          transform: 'translate(150px,25px)'
        })),
        animate('0.5s 0.2s ease', style({
          opacity: 0
        }))
      ])
    ])
  ])
]
})
export class ChatComponent implements OnInit {
  chats: IChat[] = [];
  message: string;
  sending: boolean;

  constructor(private _chatService: ChatService) { }

  ngOnInit() {
    // subscribe to pusher's event
    this._chatService.getChannel().bind('chat', data => {
      if (data.email === this._chatService.user.email) {
        data.isMe = true;
      }
      this.chats.push(data);
    });
  }

  sendMessage(message: string) {
    this.sending = true;
    this._chatService.sendMessage(message)
      .subscribe(resp => {
        this.message = undefined;
        this.sending = false;
      }, err => {
        this.sending = false;
      } );
  }

}
