import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {

  name: string = '';
  password: string = '';


  constructor(private authService: AuthService) {}

  register() {

    this.authService.register(this.name, this.password).subscribe({
      next: (res: any) => {
        console.log();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

}