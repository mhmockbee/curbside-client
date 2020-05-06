import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as signalR from '@aspnet/signalr';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import * as actions from '../actions/socket.actions';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class SocketEffects {
  readonly baseUrl = environment.wsUrl + '/curbsidehub';

  sendOrder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.curbsideOrderRequest),
        tap((a) => console.log(a.payload)),
        tap((a) => this.hubConnection.send('PlaceOrder', a.payload))
      ),
    { dispatch: false }
  );

  private hubConnection: signalR.HubConnection;

  constructor(private actions$: Actions, private store: Store<AppState>) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl)
      .build();

    this.hubConnection
      .start()
      .then((c) => console.log('Hub Connection Started!'))
      .catch((err) => console.error(`Error in Hub Connection ${err}`));

    // actions.orderItemProcessed
    // actions.orderPlaced
    // actions.orderProcessed
    this.hubConnection.on('OrderPlaced', (data) =>
      this.store.dispatch(actions.orderPlaced({ payload: data }))
    );

    this.hubConnection.on('OrderProcessed', (data) =>
      this.store.dispatch(actions.orderProcessed({ payload: data }))
    );

    this.hubConnection.on('OrderItemProcessed', (data) =>
      this.store.dispatch(actions.orderItemProcessed({ ...data }))
    );
  }
}
