import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap  } from '@angular/router';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ownImgType } from '../mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create-component.component.html',
  styleUrls: ['./post-create-component.component.css']
})
export class PostCreateComponentComponent implements OnInit {

  postId: string;
  private mode = 'create';
  selectedPost: Post;
  isLoading = false;
  imagePreview= '';

  form: FormGroup;
   
  constructor(public postService : PostService, public route: ActivatedRoute ) { }
  
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]} ),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl( null , { validators: [Validators.required] , asyncValidators: [ownImgType]})
    });

      this.route.paramMap
        .subscribe((paramap: ParamMap) => {
          if (paramap.has('id')) {
            this.mode = 'edit';
            this.postId = paramap.get("id");
            this.isLoading = true;
            this.postService.getPostForEdit(this.postId)
              .subscribe((postData) => {
                this.isLoading = false;
                this.selectedPost = {
                  id: postData.post._id,
                  title: postData.post.title,
                  content: postData.post.content,
                  imagePath: postData.post.imagePath,
                  creator: null
                }
                this.form.setValue({
                  title: postData.post.title,
                  content: postData.post.content,
                  image: postData.post.imagePath
                }) 
              })
          } else {
            this.mode = 'create';
            this.postId = null;
          }
        });
    }
  
  SendPost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.isLoading = true;
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.isLoading = true;
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);      
    }
    this.form.reset();
  }
  
  imagePicked( event : Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }
     
  
}
