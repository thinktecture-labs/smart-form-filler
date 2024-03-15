import { Routes } from '@angular/router';
import { PasteComponent } from './pages/paste/paste.component';

export const routes: Routes = [{
  path: '',
  redirectTo: 'paste',
  pathMatch: 'full'
}, {
  path: 'paste',
  component: PasteComponent
}];
