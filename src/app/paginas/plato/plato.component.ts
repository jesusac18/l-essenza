import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FirestoreService } from '../../servicios/firestore.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-plato',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './plato.component.html',
  styleUrl: './plato.component.css'
})
export class PlatoComponent {
  plato: any;

  @Input() platoId: any;
  @Input() categoriaId: any;

  constructor(private route:ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.platoId = this.route.snapshot.paramMap.get('idPlato') || "";
    this.categoriaId = this.route.snapshot.paramMap.get('idCategoria') || "";
    this.firestoreService.getPlatoById(this.categoriaId, this.platoId).subscribe(data => {
      this.plato = data;
    });
  }
}
