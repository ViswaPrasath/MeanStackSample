import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) { }
    
    getPost() {
        return this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(map(postData => {
                return postData.posts.map(posts => {
                    return {
                        id: posts._id,
                        title: posts.title,
                        content: posts.content
                    }
                })
            }))
            .subscribe((transformedPost) => {
                this.posts = transformedPost;
                this.postsUpdated.next([...this.posts]);
            });
    };

    getPostUpdated() {
        return this.postsUpdated.asObservable();   
    }

    getPostForEdit(postId: string) {
        return this.http.get<{message: string, post: {_id: string, title: string , content: string}}>('http://localhost:3000/api/posts/' + postId);
    }

    // getPostForEdit(postId: string) {
    //     console.log( this.posts )
    //     return { ...this.posts.find( post => post.id === postId)}
    // }

    addPost(title: string, content: string) {
        const post: Post = { id: null , title: title, content: content };
        this.http.post<{ message: string , postId: string }>('http://localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                const id = responseData.postId;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
    };
   
    updatePost(id: string, title: string, content: string) {
        const post = { id: id, title: title, content: content };

        this.http.put('http://localhost:3000/api/posts/' + id, post)
            .subscribe((response) => {
                const updatePost = [...this.posts];
                const oldPostIndex = updatePost.findIndex(p => p.id === id);
                updatePost[oldPostIndex] = post;
                this.posts = updatePost;
                this.postsUpdated.next([...this.posts]);
            });
    }

    deletePost(postId : string) {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
            .subscribe(result => {
                console.log(result);
                const updatedPost = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPost;
                this.postsUpdated.next([...this.posts]);
            });
    };
}