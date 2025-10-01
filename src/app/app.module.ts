import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from "@angular/material/sidenav";

import { VeronaSubscriptionService } from "../../projects/verona/src/lib/host/verona-subscription.service";
import { VeronaPostService } from "../../projects/verona/src/lib/host/verona-post.service";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UnitActivateGuard } from './services/unit-route-guards';
import { ValidationService } from './services/validation.service';
import { BroadcastService } from './services/broadcast.service';
import { ResponsesComponent, SettingsComponent } from "./components";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    SettingsComponent,
    ResponsesComponent
  ],
  providers: [
    provideZonelessChangeDetection(),
    UnitActivateGuard,
    ValidationService,
    BroadcastService,
    VeronaSubscriptionService,
    VeronaPostService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
