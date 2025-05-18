import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from '../../servicios/firestore.service';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent {
  reservaForm: FormGroup;
  loading = false;
  mesas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Puedes ajustar la cantidad de mesas

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar
  ) {
    this.reservaForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      personas: ['', [Validators.required, Validators.min(1)]],
      mesa: ['', Validators.required],
      estado: ['pendiente'], // atributo oculto para admins
    });
  }

  async reservar() {
    console.log('Intentando reservar...');
    if (this.reservaForm.valid) {
      this.loading = true;
      const formValue = this.reservaForm.value;
      const fechaISO = formValue.fecha instanceof Date ? formValue.fecha.toISOString().substring(0, 10) : formValue.fecha;
      const reserva = { ...formValue, fecha: fechaISO };
      try {
        // Comprobar si ya existe una reserva para la misma mesa, fecha y hora
        const existe = await this.firestoreService.existeReservaMesa(fechaISO, reserva.hora, reserva.mesa);
        if (existe) {
          this.snackBar.open('Ya existe una reserva para esa mesa, día y hora.', 'Cerrar', { duration: 5000 });
        } else {
          await this.firestoreService.guardarReserva(reserva);
          this.snackBar.open('¡Reserva guardada con éxito!', 'Cerrar', { duration: 5000 });
          this.reservaForm.reset();
        }
      } catch (error) {
        console.error('Error al guardar reserva:', error);
        this.snackBar.open('Error al guardar la reserva.', 'Cerrar', { duration: 5000 });
      }
      this.loading = false;
    } else {
      console.warn('Formulario no válido:', this.reservaForm.value);
    }
  }

}
