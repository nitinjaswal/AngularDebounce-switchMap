import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  of,
  delay,
  concatMap,
  catchError,
} from 'rxjs';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface OrderItem {
  productId: number;
  quantity: number;
}

interface Order {
  items: OrderItem[];
  userId: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-debouncing';
  searchControl = new FormControl('');
  users: any[] = [];
  loading = false;
  confirmation: string | null = null;
  posts: Post[] = [];
  error: string | null = null;
  private usersUrl = 'https://jsonplaceholder.typicode.com/users';
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts?userId=';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.switchMap();
    this.concatMapFunc();
  }

  private switchMap() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500), //It will make sure to hit the api only when differnce between  2 key strokes is more than 500 ms

        // distinctUntilChanged(),
        switchMap((searchTerm) => {
          //cancels previous request if new request is made before previous request is completed
          if (!searchTerm || !searchTerm.trim()) {
            this.users = [];
            return of([]); //Return empty observable if search term is empty
          }
          this.loading = true;
          return this.searchUsers(searchTerm).pipe(
            finalize(() => (this.loading = false))
          );
        })
      )
      .subscribe((users) => (this.users = users));
  }

  searchUsers(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.users = [];
      return of([]);
    }
    this.loading = true;
    return this.http.get<any[]>(
      `https://jsonplaceholder.typicode.com/users?name_like=${searchTerm}`
    );
  }

  private concatMapFunc() {
    this.loading = true;
    this.http
      .get<User[]>(this.usersUrl)
      .pipe(
        delay(1000),
        concatMap((users) => {
          if (users.length > 0) {
            return this.http.get<Post[]>(`${this.postsUrl}${users[0].id}`);
          } else {
            return of([]);
          }
        })
      )
      .subscribe({
        next: (posts) => {
          this.posts = posts;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'An error occurred: ' + err.message;
          this.loading = false;
        },
      });
  }

  placeOrder() {
    this.loading = true;
    this.error = null;
    this.confirmation = null;

    const order: Order = {
      userId: 1,
      items: [{ productId: 101, quantity: 2 }],
    };

    this.authenticateUser()
      .pipe(
        concatMap(() => this.checkInventory(order.items)),
        concatMap(() => this.placeOrderRequest(order)),
        concatMap((orderId) => this.getOrderConfirmation(orderId)),
        catchError((err) => {
          this.error = 'An error occurred: ' + err.message;
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((confirmation: any) => {
        if (confirmation) {
          this.confirmation = confirmation;
          alert('Order Placed Successfully');
        }
        this.loading = false;
      });
  }
  authenticateUser() {
    return of(true).pipe(delay(500));
  }

  checkInventory(items: OrderItem[]) {
    return of(true).pipe(delay(500));
  }

  placeOrderRequest(order: Order) {
    const orderId = Math.floor(Math.random() * 1000);
    return of(orderId).pipe(delay(500));
  }

  getOrderConfirmation(orderId: number) {
    return of(`Order ${orderId} has been placed`).pipe(delay(500));
  }
}
