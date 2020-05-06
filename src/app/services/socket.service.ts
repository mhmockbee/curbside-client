import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from '../../environments/environment';
@Injectable()
export class SocketService {
  readonly baseUrl = environment.wsUrl + '/curbsidehub';

  private hubConnection: signalR.HubConnection;
  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl)
      .build();

    this.hubConnection
      .start()
      .then((c) => console.log('Hub Connection Started!'))
      .catch((err) => console.error(`Error in Hub Connection ${err}`));
  }
}
