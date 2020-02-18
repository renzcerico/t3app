import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [
{
path: '',
component: HeaderComponent
},
{
path: 'home',
component: HeaderComponent
},
{
path: '**',
component: HeaderComponent
},
];
@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
