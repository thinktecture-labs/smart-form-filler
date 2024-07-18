import { Routes } from '@angular/router';
import { DemoPasteComponent } from './pages/demo-paste/demo-paste.component';
import { PasteComponent } from './pages/paste/paste.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'paste',
    pathMatch: 'full',
  },
  {
    path: 'paste',
    component: PasteComponent,
  },
  {
    path: 'demo-paste',
    component: DemoPasteComponent,
  },
];
