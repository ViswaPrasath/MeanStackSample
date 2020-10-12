import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { PostCreateComponentComponent } from './post-create-component/post-create-component.component';
import { PostListComponent } from './postList/postList.component';
import { AuthGuard } from './Auth/auth.guard';
 
const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create' , component: PostCreateComponentComponent, canActivate: [AuthGuard]},
  { path: 'edit/:id', component: PostCreateComponentComponent, canActivate: [AuthGuard] },
  { path: 'auth' , loadChildren: () => import('./Auth/auth.module').then( m => m.AuthModule)} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
