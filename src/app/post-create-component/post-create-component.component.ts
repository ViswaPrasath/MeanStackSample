import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostService } from '../post.service';

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

  constructor(public postService : PostService, public route: ActivatedRoute) { }
  
    ngOnInit(): void {
      this.route.paramMap
        .subscribe((paramap: ParamMap) => {
          if (paramap.has('id')) {
            this.mode = 'edit';
            this.postId = paramap.get("id");
            this.isLoading = true;
            this.postService.getPostForEdit(this.postId)
              .subscribe((postData) => {
                this.isLoading = false;
                this.selectedPost = { id: postData.post._id , title: postData.post.title, content: postData.post.content }
             })
          } else {
            this.mode = 'create';
            this.postId = null;
          }
        });
    }
  
  SendPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(postForm.value.title, postForm.value.content);
    } else {
      this.postService.updatePost(this.postId, postForm.value.title, postForm.value.content);           
      console.log("update call")
    }
    postForm.resetForm();
  } 
  
}
