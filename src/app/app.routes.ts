import { Routes } from '@angular/router'; 
import { AuthGuard } from './servicios/guard/auth.guard';  
import { RegisterComponent } from './paginas/register/register.component';
import { AccountComponent } from './paginas/account/account.component';
import { LoginComponent } from './paginas/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent }, 
    { path: '', redirectTo: '/login', pathMatch: 'full' }  
  ];  
