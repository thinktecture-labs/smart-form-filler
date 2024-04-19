import { Routes } from '@angular/router';
import { Demo1Component } from './pages/demo-1/demo-1.component';
import { Demo2Component } from './pages/demo-2/demo-2.component';
import { DemoPasteComponent } from './pages/demo-paste/demo-paste.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'demo-paste',
    pathMatch: 'full',
  },
  {
    path: 'demo-paste',
    component: DemoPasteComponent,
  },
  {
    path: 'demo-1',
    component: Demo1Component,
  },
  {
    path: 'demo-2',
    component: Demo2Component,
  },
];
