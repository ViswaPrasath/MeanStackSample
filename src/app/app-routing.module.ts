import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostCreateComponentComponent } from './post-create-component/post-create-component.component';
import { PostListComponent } from './postList/postList.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create' , component: PostCreateComponentComponent},
  { path: 'edit/:id' , component: PostCreateComponentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
