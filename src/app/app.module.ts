import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import { AppRootComponent } from './app-root/app-root.component';
import { UnitHostComponent } from './unit-host/unit-host.component';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {UnitActivateGuard} from "./unit-host/unit-route-guards";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    AppRootComponent,
    UnitHostComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NoopAnimationsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule
    ],
  providers: [
    UnitActivateGuard,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
