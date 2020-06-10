import { ActivityComponent } from './activity/activity.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AccountsComponent } from './accounts/accounts.component';

const routes: Routes = [
{
    path: '',
    component: HeaderComponent
},
{
<<<<<<< HEAD
    path: 'accounts',
    component: AccountsComponent
},
{
path: '**',
component: HeaderComponent
=======
    path: 'activity',
    component: ActivityComponent
>>>>>>> 2e277c0cff6fe5e643052abf70dcbbe7a736094e
},
// {
//     path: '**',
//     component: ActivityComponent
//     },
];
@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
