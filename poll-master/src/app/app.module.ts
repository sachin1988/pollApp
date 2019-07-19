import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { WebSocketSvc } from "./services";

// Routes
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  {
    path: 'quiz',
    component: QuizComponent
  },
  { path: '', pathMatch: 'full', redirectTo: 'quiz' },
  { path: '**', pathMatch: 'full', redirectTo: 'quiz' },
];

export const appRouting = RouterModule.forRoot(routes);

// Components
import { WelcomeComponent } from './components/welcome/welcome.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { AnswerComponent } from './components/answer/answer.component';
import { AdminComponent } from 'app/components/admin/admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    AppComponent,
    WelcomeComponent,
    QuizComponent,
    AnswerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NoopAnimationsModule,
    MaterialModule,
    appRouting
  ],
  providers: [
    WebSocketSvc
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
