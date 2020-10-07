import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-post-list',
    templateUrl: './postList.component.html',
    styleUrls: ['./postList.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{
    // posts = [
    //     { title: 'First post', content: "First post\'s content" },
    //     { title: 'second post', content: "second post\'s content" },
    //     { title: 'third post', content: "third post\'s content" }
    // ];

     posts: Post[] = [];
    postSub = new Subscription();
    isLoading: boolean = false; 

    constructor(private postService: PostService) { }
    
    ngOnInit() {
        this.isLoading = true;
        this.postService.getPost();
        this.postSub = this.postService.getPostUpdated().subscribe((post: Post[]) => {
            this.isLoading = false;
            this.posts = post;
         });
    }
    deletePost(postId: string) {
        this.postService.deletePost(postId);
    }
 
    ngOnDestroy() {
        this.postSub.unsubscribe();
    }
     
}