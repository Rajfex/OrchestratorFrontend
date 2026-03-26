import { Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel, HttpTransportType } from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class NotificationSSEService {
  private hubConnection?: HubConnection;
  private isStarting = false;

  readonly messages = signal<{ text: string }[]>([]);

  async startConnection(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected || this.isStarting) {
      return;
    }

    this.isStarting = true;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7006/notifications', {
        withCredentials: true,

        transport: HttpTransportType.ServerSentEvents
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.messages.update((prev) => [...prev, { text: message }]);
    });

    try {
      await this.hubConnection.start();
      console.log('Połączenie SSE rozpoczęte');
    } catch (err) {
      console.log(err);
    } finally {
      this.isStarting = false;
    }
  }

  closeConnection(): void {
    if (!this.hubConnection) {
      return;
    }

    void this.hubConnection.stop();
    this.hubConnection = undefined;
    this.isStarting = false;
  }
}