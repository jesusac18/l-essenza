import { Routes } from '@angular/router'; 
import { AuthGuard } from './servicios/guard/auth.guard';  
import { RegisterComponent } from './paginas/register/register.component';
import { AccountComponent } from './paginas/account/account.component';
import { LoginComponent } from './paginas/login/login.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { ConocenosComponent } from './paginas/conocenos/conocenos.component';
import { CartaComponent } from './paginas/carta/carta.component';
import { ReservaComponent } from './paginas/reserva/reserva.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent }, 
    { path: 'inicio', component: InicioComponent },
    { path: 'conocenos', component: ConocenosComponent },
    { path: 'carta', component: CartaComponent },
    { path: 'reserva', component: ReservaComponent },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' }
  ];  
