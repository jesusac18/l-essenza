import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterLink
  ]
})
export class RegisterComponent implements OnInit {
  step1!: FormGroup;
  step2!: FormGroup;
  step3!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.step1 = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.step2 = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });

    this.step3 = this.fb.group({
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      recibirNovedades: [false],
      recibirFacturasPorEmail: [false]
    });
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  onSubmit(): void {
    if (this.step1.valid && this.step2.valid && this.step3.valid) {
      const { name, email } = this.step1.value;
      const { password } = this.step2.value;
      const { telefono, direccion, recibirNovedades, recibirFacturasPorEmail } = this.step3.value;

      this.authService.registerWithEmail(email, password, name, telefono, direccion, recibirNovedades, recibirFacturasPorEmail)
        .then(() => {
          this.snackBar.open('Se ha enviado un correo de verificación. Revisa tu bandeja de entrada.', 'Cerrar', {
            duration: 6000
          });
          this.router.navigate(['/login']);
        })
        .catch(() => {
          this.snackBar.open('Error al registrar el usuario. Inténtalo nuevamente.', 'Cerrar', {
            duration: 6000
          });
        });
    } else {
      this.snackBar.open('Completa correctamente todos los campos del formulario.', 'Cerrar', {
        duration: 6000
      });
    }
  }
}