import { ChangeDetectionStrategy, Component, computed, inject, Pipe, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NotificationWebSocketsService } from '../notificationWebScokets.service';
import { NotificationLongPollingService } from '../notificationLongPolling.service';
import { NotificationSSEService } from '../notificationSEE.service';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly authService = inject(AuthService);

  readonly loginForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly token = this.authService.token;
  readonly errorMessage = signal('');

  private readonly notificationWebSocketsService = inject(NotificationWebSocketsService);
  readonly notificationsWebSockets = this.notificationWebSocketsService.messages;

  removeNotificationWebSockets(index: number) {
    this.notificationsWebSockets.update(list => list.filter((_, i) => i !== index));
  }

  private readonly notificationLongPollingService = inject(NotificationLongPollingService);
  readonly notificationsLongPolling = this.notificationLongPollingService.messages;

  removeNotificationLongPolling(index: number) {
    this.notificationsLongPolling.update(list => list.filter((_, i) => i !== index));
  }

  private readonly notificationSEEService = inject(NotificationSSEService);
  readonly notificationsSEE = this.notificationSEEService.messages;

  retmoveNotificationSEE(index: number) {
    this.notificationsSEE.update(list => list.filter((_, i) => i !== index));
  }

  ngOnInit(){
    this.notificationWebSocketsService.startConnection();
    this.notificationLongPollingService.startConnection();
    this.notificationSEEService.startConnection();
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');

    const { name, password } = this.loginForm.getRawValue();
    this.authService.login(name, password).subscribe({
      next: () => {
        this.loginForm.reset({ name: '', password: '' });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.status === 401 ? 'Invalid credentials' : 'Login failed');
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
