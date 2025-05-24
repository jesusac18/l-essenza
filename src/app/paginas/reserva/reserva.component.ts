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

  aforo: any = null;

  readonly turnos = [
    { nombre: 'Mañana', inicio: '12:00', fin: '16:00' },
    { nombre: 'Noche', inicio: '20:00', fin: '00:00' }
  ];

  horariosManana = this.generarHorarios('12:00', '16:00');
  horariosNoche = this.generarHorarios('20:00', '00:00');
  get horariosDisponibles() {
    return ['13:00', '15:00', '20:00', '22:00'];
  }

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
    });
  }

  async ngOnInit() {
    this.aforo = await this.firestoreService.getAforo();
  }

  async reservar() {
    console.log('Intentando reservar...');
    if (this.reservaForm.valid) {
      this.loading = true;
      const formValue = this.reservaForm.value;
      const fechaISO = formValue.fecha instanceof Date ? formValue.fecha.toISOString().substring(0, 10) : formValue.fecha;
      const hora = formValue.hora;
      const personas = Number(formValue.personas);
      const reservaBase = { ...formValue, fecha: fechaISO };
      try {
        const turno = this.turnos.find(t => this.estaEnTurno(hora, t.inicio, t.fin));
        if (!turno) {
          this.snackBar.open('La hora seleccionada no está dentro del horario de apertura.', 'Cerrar', { duration: 5000 });
          this.loading = false;
          return;
        }
        const reservasMismaFechaHora = await this.firestoreService.getReservasPorFechaHora(fechaISO, hora);
        const comensalesActuales = reservasMismaFechaHora.reduce((acc: number, r: any) => acc + Number(r.personas), 0);
        if (comensalesActuales + personas > this.aforo.maxComensales) {
          this.snackBar.open('No hay espacio suficiente para comensales en esa hora.', 'Cerrar', { duration: 5000 });
          this.loading = false;
          return;
        }
        const mesasOcupadas = reservasMismaFechaHora.map((r: any) => r.mesa);
        const mesasDisponibles = (this.aforo.mesas || []).filter((m: number) => !mesasOcupadas.includes(m));
        if (mesasDisponibles.length === 0) {
          this.snackBar.open('No quedan mesas disponibles para esa hora.', 'Cerrar', { duration: 5000 });
          this.loading = false;
          return;
        }
        const mesaAsignada = mesasDisponibles[Math.floor(Math.random() * mesasDisponibles.length)];
        const reserva = { ...reservaBase, mesa: mesaAsignada };
        await this.firestoreService.guardarReserva(reserva);
        this.snackBar.open(`¡Reserva guardada con éxito! Mesa asignada: ${mesaAsignada}`, 'Cerrar', { duration: 7000 });
        this.reservaForm.reset();
      } catch (error) {
        console.error('Error al guardar reserva:', error);
        this.snackBar.open('Error al guardar la reserva.', 'Cerrar', { duration: 5000 });
      }
      this.loading = false;
    } else {
      console.warn('Formulario no válido:', this.reservaForm.value);
    }
  }

  estaEnTurno(hora: string, inicio: string, fin: string): boolean {

    const [h, m] = hora.split(':').map(Number);
    const [hi, mi] = inicio.split(':').map(Number);
    let [hf, mf] = fin.split(':').map(Number);
    if (fin === '00:00') { hf = 24; }
    const minutos = h * 60 + m;
    const minInicio = hi * 60 + mi;
    const minFin = hf * 60 + mf;
    return minutos >= minInicio && minutos < minFin;
  }

  generarHorarios(inicio: string, fin: string): string[] {
    const horarios: string[] = [];
    let [h, m] = inicio.split(':').map(Number);
    let [hf, mf] = fin.split(':').map(Number);
    if (fin === '00:00') hf = 24;
    while (h * 60 + m < hf * 60 + mf) {
      const horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      horarios.push(horaStr);
      m += 15;
      if (m >= 60) { h++; m = 0; }
    }
    return horarios;
  }

  mesasDisponibles() {
    return this.aforo.mesas || [];
  }

}
