import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { FirestoreService } from '../../servicios/firestore.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatGridListModule,
    MatIconModule
  ],
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.css'
})
export class CartaComponent {
  platos: any[] = [];
  categorias: any[] = [];

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.getAllPlatos().subscribe(data => {
      this.platos = data;
    });

    this.firestoreService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }
}
