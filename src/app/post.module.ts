import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './angular-material.module';

import { PostCreateComponentComponent } from './post-create-component/post-create-component.component';
import { PostListComponent } from './postList/postList.component';

@NgModule({
    declarations: [
        PostCreateComponentComponent,
        PostListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class PostModule{

}