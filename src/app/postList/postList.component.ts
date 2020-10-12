import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../Auth/auth.service';

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
    private postSub = new Subscription();
    isLoading: boolean = false; 

    //pagniation
    totalPost = 0;
    postPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    //authentication
    authStatus = false;
    userId: string;
    private authStatusSub: Subscription;

    constructor(private postService: PostService, private authService: AuthService) { }
    
    ngOnInit() {
        this.isLoading = true;
        this.postService.getPost(this.postPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postSub = this.postService.getPostUpdated().subscribe((postData: { post: Post[] , maxPost: number }) => {
            this.isLoading = false;
            this.posts = postData.post;
            this.totalPost = postData.maxPost
        });
        this.authStatus = this.authService.getAuth();
        this.authStatusSub = this.authService.getAuthStatus().subscribe(isAuthenticated => {
            this.authStatus = isAuthenticated;
            this.userId = this.authService.getUserId();
        })
    }

    onChangePage(event: PageEvent) {
        this.isLoading = true;
        this.postPerPage = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.postService.getPost(this.postPerPage, this.currentPage);       
    }

    deletePost(postId: string) {
        this.postService.deletePost(postId).subscribe(() => {
            this.postService.getPost(this.postPerPage, this.currentPage);
        })
    }
 
    ngOnDestroy() {
        this.postSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
     
}