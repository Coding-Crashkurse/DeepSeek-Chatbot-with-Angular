import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

// Einfache Routen-Konfiguration.
// Du kannst bei Bedarf weitere Komponenten anlegen und hier referenzieren.
export const routes: Routes = [
  {
    path: '',
    component: AppComponent, // (nicht immer empfohlen, RootComponent in Route zu packen — aber als Minimal-Beispiel ok)
  },
];
