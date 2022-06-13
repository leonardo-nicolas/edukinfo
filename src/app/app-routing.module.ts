/**
 * Arquivo: src/app/app-routing.module.ts
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Importação das páginas
import { HomeComponent } from "./components/pages/home/home.component";
import { NotFoundComponent } from "./components/pages/error/not-found.component";
import { CoursesComponent } from "./components/pages/courses/courses.component";
import { LoginComponent } from "./components/pages/login/login.component";
import { CourseComponent } from "./components/pages/course/course.component";
import { CheckoutComponent } from "./components/pages/checkout/checkout.component";
import { ShoppingCartComponent } from "./components/pages/shopping-cart/shopping-cart.component";
import { SearchComponent } from "./components/pages/search/search.component";
import { SignUpComponent } from "./components/pages/sign-up/sign-up.component";
import { AboutComponent } from "./components/pages/about/about.component";
import { DashboardComponent } from "./components/pages/dashboard/dashboard.component";
//Importação dos guardas de rotas
import { NaoExisteLoginGuard } from "./guards/nao-existe-login.guard";
import { LoginGuard } from "./guards/login.guard";

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'404', component: NotFoundComponent},
  {path:'home', redirectTo:''},
  {path:'sobre',component:AboutComponent},
  {path:'sobre/:secao',component:AboutComponent},
  {path:'login', canActivate:[NaoExisteLoginGuard], component:LoginComponent},
  {path:'login/:secao', canActivate:[NaoExisteLoginGuard], component:LoginComponent},
  {path:'cadastro',canActivate:[NaoExisteLoginGuard], component:SignUpComponent},
  {path:'dashboard',canActivate:[LoginGuard],component:DashboardComponent},
  {path:'cart',canActivate:[LoginGuard],component:ShoppingCartComponent},
  {path:'checkout',canActivate:[LoginGuard],component:CheckoutComponent},
  {path:'cursos',component:CoursesComponent},
  {path:'cursos/:categoria',component:CoursesComponent},
  {path:'cursos/:categoria/:filtro',component:CoursesComponent},
  {path:'curso/:id',component:CourseComponent},
  {path:'search',component:SearchComponent},
  {path:'**', redirectTo:'404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
