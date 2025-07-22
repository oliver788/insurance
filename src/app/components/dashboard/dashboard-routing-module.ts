import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Homeinsurace } from './homeinsurace/homeinsurace';
import { Compulsoryinsurace } from './compulsoryinsurace/compulsoryinsurace';
import { Cascoinsurace } from './cascoinsurace/cascoinsurace';
const routes: Routes = [
  {
path: '',
component: Home
},
{
path: 'homeinsurace',
component: Homeinsurace
},
{
path: 'cascoinsurace',
component: Cascoinsurace
},
{
path: 'compulsoryinsurace',
component: Compulsoryinsurace
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
