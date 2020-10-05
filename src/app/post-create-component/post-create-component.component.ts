import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create-component.component.html',
  styleUrls: ['./post-create-component.component.css']
})
export class PostCreateComponentComponent implements OnInit {

  constructor(public postService : PostService) { }

  // enteredTitle = '';
  // enteredContent = '';
  // @Output() postCreated = new EventEmitter<Post>();
  
  SendPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    // const post: Post = { title: postForm.value.title, content: postForm.value.content }
    // this.postCreated.emit(post);
    this.postService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
  } 

  ngOnInit(): void {
  }

}
