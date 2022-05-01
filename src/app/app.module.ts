import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {AccordionModule} from "ngx-bootstrap/accordion";
import {AlertModule} from "ngx-bootstrap/alert";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {CarouselModule} from "ngx-bootstrap/carousel";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {ModalModule} from "ngx-bootstrap/modal";
import {ProgressbarModule} from "ngx-bootstrap/progressbar";
import {TabsModule} from "ngx-bootstrap/tabs";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {TypeaheadModule} from "ngx-bootstrap/typeahead";
// #region componentes
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { NotFoundComponent } from './components/pages/error/not-found.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { CoursesComponent } from './components/pages/courses/courses.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { CourseComponent } from './components/pages/course/course.component';
import { AboutComponent } from './components/pages/about/about.component';
import { SearchComponent } from './components/pages/search/search.component';
import { BtnDarkModeComponent } from './components/elements/btn-dark-mode/btn-dark-mode.component';
import { TermosUsoComponent } from './components/pages/sign-up/termos-uso/termos-uso.component';
import { AboutCollectiveComponent } from './components/pages/about/about-collective/about-collective.component';
import { RendererModule, TransferHttpCacheModule } from '@nguniversal/common/clover';
// #endregion componentes

@NgModule({
  declarations: [
    AppComponent,NotFoundComponent,
    MenuComponent,FooterComponent,
    HomeComponent,AboutComponent,SearchComponent,
    LoginComponent, SignUpComponent, DashboardComponent,
    CoursesComponent, CourseComponent, BtnDarkModeComponent, TermosUsoComponent, AboutCollectiveComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'appId' }), BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule, HttpClientJsonpModule,
    AccordionModule.forRoot(), CollapseModule.forRoot(), TabsModule.forRoot(), BsDropdownModule.forRoot(),
    AlertModule.forRoot(), TypeaheadModule.forRoot(),
    ButtonsModule.forRoot(), BsDatepickerModule.forRoot(), ProgressbarModule.forRoot(),
    CarouselModule.forRoot(), ModalModule.forRoot(), TooltipModule.forRoot(), RendererModule.forRoot(), TransferHttpCacheModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
