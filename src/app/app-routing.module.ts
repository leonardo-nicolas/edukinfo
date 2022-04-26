import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/pages/error/not-found.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { CoursesComponent } from './components/pages/courses/courses.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { CourseComponent } from './components/pages/course/course.component';
import { AboutComponent } from './components/pages/about/about.component';
import { SearchComponent } from './components/pages/search/search.component';
import { ExisteLoginGuard } from './guards/existe-login.guard';
import { LoginGuard } from './guards/login.guard';


const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'404', component: NotFoundComponent},
  {path:'home', redirectTo:''},
  {path:'sobre',component:AboutComponent},
  {path:'sobre/:secao',component:AboutComponent},
  {path:'login/', canActivate:[ExisteLoginGuard], component:LoginComponent, },
  {path:'login/:secao', canActivate:[ExisteLoginGuard], component:LoginComponent, },
  {path:'cadastro',canActivate:[ExisteLoginGuard], component:SignUpComponent},
  {path:'dashboard',canActivate:[LoginGuard],component:DashboardComponent},
  {path:'cursos',component:CoursesComponent},
  {path:'cursos/:categoria/:filtro',component:CoursesComponent},
  {path:'curso/:id',component:CourseComponent},
  {path:'search',component:SearchComponent},
  {path:'**', redirectTo:'404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
