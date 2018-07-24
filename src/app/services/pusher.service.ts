import { Injectable } from '@angular/core';
import * as Pusher from 'pusher-js';

// This is here to discourage the instantiating of Pusher any where its
// needed, better to reference it from one place
@Injectable()
export class PusherService {
  private _pusher: any;

  constructor() {
    // Needs Pusher API key and cluster
    this._pusher = new Pusher('3de599a26e86c747bb15', {
      cluster: 'eu',
      encrypted: true
    });
  }
  // Any time a Pusher instance is needed, call this method
  getPusher() {
    return this._pusher;
  }
}
