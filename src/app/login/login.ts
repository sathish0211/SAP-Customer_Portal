import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {

  showPassword = signal(false);
  loginForm: FormGroup;
  errorMessage = signal('');
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  constructor() {
    this.loginForm = this.fb.group({
      customerId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  login() {

    if (this.loginForm.invalid) return;

    const { customerId, password } = this.loginForm.value;

    this.errorMessage.set('');  // UPDATED

    this.http.post('http://localhost:3001/login', { customerId, password })
      .subscribe({

        next: (res: any) => {
          if (res.status === 'SUCCESS') {
            localStorage.setItem("customerId", customerId);
            this.router.navigate(['/home']);
          } 
          else if (res.status === 'FAIL') {
            this.errorMessage.set("Invalid credentials");  // UPDATED
          }
        },

        error: (err) => {
          console.error(err);
          this.errorMessage.set("Server error. Please try again.");  // UPDATED
        }

  });
}

}
