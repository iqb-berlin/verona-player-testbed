import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { UnitHostComponent } from './unit-host/unit-host.component';
import { UnitActivateGuard } from './unit-host/unit-route-guards';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
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
    MatRadioModule,
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
