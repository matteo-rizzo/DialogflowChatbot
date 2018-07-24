import { Injectable } from '@angular/core';
import * as Pusher from 'pusher-js';
import { env } from 'process';
import { environment } from '../../environments/environment';

// This is here to discourage the instantiating of Pusher any where its
// needed, better to reference it from one place
@Injectable()
export class PusherService {
  private _pusher: any;

  constructor() {
    // Needs Pusher API key and cluster
    this._pusher = new Pusher(environment.pusher.key, {
      cluster: 'eu',
      encrypted: true
    });
  }
  // Any time a Pusher instance is needed, call this method
  getPusher() {
    return this._pusher;
  }
}
