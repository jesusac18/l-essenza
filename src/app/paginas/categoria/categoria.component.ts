import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FirestoreService } from '../../servicios/firestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule, 
    RouterLink,
    CommonModule
  ],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {
  categoria: any;
  platos: any[] = [];

  @Input() categoriaId: string = '';

  constructor(private route:ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.categoriaId = this.route.snapshot.paramMap.get('idCategoria') || "";
    this.firestoreService.getCategoriaById(this.categoriaId).subscribe(data => {
      this.categoria = data;
    });
    this.firestoreService.getPlatosByCategoriaId(this.categoriaId).subscribe(data => {
      this.platos = data;
    });    
  }
}