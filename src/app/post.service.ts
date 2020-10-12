import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '.././environments/environment';


const BACKEND_URL = environment.apiUrl + 'posts';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject < {post: Post[], maxPost: number }>();

    constructor(private http: HttpClient,  public router: Router) { }
    
    getPost(postSize: number, currentPage: number) {
        const queryParams = `?pagesize=${postSize}&page=${currentPage}`;
        return this.http.get<{ message: string, posts: any, maxPost: number }>(BACKEND_URL + queryParams)
            .pipe(map(postData => {
                return {
                    post: postData.posts.map(posts => {
                        return {
                            id: posts._id,
                            title: posts.title,
                            content: posts.content,
                            imagePath: posts.imagePath,
                            creator: posts.creator
                        }
                    }),
                    maxPost: postData.maxPost
                };
            }))
            .subscribe((transformedPost) => {
                this.posts = transformedPost.post;
                this.postsUpdated.next({ post: [...this.posts] , maxPost: transformedPost.maxPost});
            });
    };

    getPostUpdated() {
        return this.postsUpdated.asObservable();   
    }

    getPostForEdit(postId: string) {
        return this.http.get<{message: string, post: {_id: string, title: string , content: string, imagePath: string, creator: string}}>( BACKEND_URL +'/' + postId);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
            .subscribe((responseData) => {
                this.router.navigate(['/']);
            });
    };
   
    updatePost(id: string, title: string, content: string, imagePath: File | string ) {
        let post: Post | FormData;
        if (typeof imagePath === 'object') {
            post = new FormData();
            post.append('id', id);
            post.append('title', title);
            post.append('content', content);
            post.append('image', imagePath, title);
        } else {
         post = { id: id, title: title, content: content , imagePath: imagePath, creator: null};
        }
        this.http.put<{messsage: string , post: { id: string , title: string, content: string , imagePath: string}}>( BACKEND_URL +'/' + id, post)
            .subscribe((response) => {
                this.router.navigate(['/']);
            });
    }

    deletePost(postId : string) {
       return  this.http.delete( BACKEND_URL +'/'+ postId);
    };
}