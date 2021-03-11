import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ClienteComponent } from './cliente/cliente.component';


const routes: Routes=[
    { path:'',redirectTo:'/home', pathMatch:'full'},
    { path:'home',component: HomeComponent},    
    { path:'cliente',component:ClienteComponent},
    { path:'**', component:PageNotFoundComponent}
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}