// Arquivo: src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// importação de componentes para o módulo renderizar as páginas
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from "./components/menu/menu.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NotFoundComponent } from './components/pages/error/not-found.component';
import { AboutComponent } from './components/pages/about/about.component';
import { HomeComponent } from "./components/pages/home/home.component";
import { SearchComponent } from "./components/pages/search/search.component";
import { DashboardComponent } from "./components/pages/dashboard/dashboard.component";
import { SignUpComponent } from "./components/pages/sign-up/sign-up.component";
import { BtnDarkModeComponent } from "./components/elements/btn-dark-mode/btn-dark-mode.component";
import { CoursesComponent } from "./components/pages/courses/courses.component";
import { AboutCollectiveComponent } from "./components/pages/about/about-collective/about-collective.component";
import { ShoppingCartComponent } from "./components/pages/shopping-cart/shopping-cart.component";
import { TermosUsoComponent } from "./components/pages/sign-up/termos-uso/termos-uso.component";
import { CourseComponent } from "./components/pages/course/course.component";
import { LoginComponent } from "./components/pages/login/login.component";
import { CheckoutComponent } from "./components/pages/checkout/checkout.component";
// importação de serviços para o módulo: Bootstrap
import { AccordionModule } from "ngx-bootstrap/accordion";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AlertModule } from "ngx-bootstrap/alert";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { PopoverModule } from "ngx-bootstrap/popover";
import { ModalModule } from "ngx-bootstrap/modal";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { getBackendUrl, getBaseUrl } from "./miscelaneous";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { LogonComponent } from './components/pages/login/logon/logon.component';
import { RecuperaSenhaComponent } from './components/pages/login/recupera-senha/recupera-senha.component';
import { TrocarSenhaComponent } from './components/pages/login/trocar-senha/trocar-senha.component';

@NgModule({
  declarations: [
    AppComponent,NotFoundComponent, MenuComponent,FooterComponent,
    HomeComponent,AboutComponent,SearchComponent, CheckoutComponent,
    LoginComponent, SignUpComponent, DashboardComponent, CoursesComponent,
    CourseComponent, BtnDarkModeComponent, TermosUsoComponent,
    AboutCollectiveComponent, ShoppingCartComponent, LogonComponent, RecuperaSenhaComponent, TrocarSenhaComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule, BrowserAnimationsModule, AppRoutingModule,
    FormsModule, ReactiveFormsModule, PopoverModule, HttpClientModule,
    AccordionModule.forRoot(), CollapseModule.forRoot(), TabsModule.forRoot(),
    BsDropdownModule.forRoot(), AlertModule.forRoot(), HttpClientJsonpModule,
    TypeaheadModule.forRoot(), ButtonsModule.forRoot(), ModalModule.forRoot(),
    BsDatepickerModule.forRoot(), ProgressbarModule.forRoot(),
    CarouselModule.forRoot(), TooltipModule.forRoot(),
    PaginationModule.forRoot(),
  ],
  //providers: [],
  providers: [ //Injeções de dependências
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps:[] },
    { provide: 'BACKEND_URL', useFactory: getBackendUrl, deps:[] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
