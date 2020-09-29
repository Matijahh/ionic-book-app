import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';
import { map, tap, take, delay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { Review } from './review.model';

interface BookData{
  author: string;
  imgUrl: string;
  resime: string;
  title: string;
  featured: boolean;
  rating: number;
  review: string;
  year: number;
  userId: string;
}

/** dummy data 
 
 * [
    new Book(
      '1',
      'Assasins Creed: Renaissance',
      'Oliver Bowden',
      'Assassins Creed: Renaissance is the thrilling novelisation by Oliver Bowden based on the game series.',
      'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1394133397i/7205214._UY475_SS475_.jpg',
      'abc'
      ),
    new Book(
      '2',
      'Assasins Creed: Brotherhood',
      'Oliver Bowden',
      'Assassins Creed: Renaissance is the thrilling novelisation by Oliver Bowden based on the game series.',
      'https://images-na.ssl-images-amazon.com/images/I/71n6mes6UOL.jpg',
      'abc'
    ),
    new Book(
      '3',
      'Assasins Creed: The Secret Crusade',
      'Oliver Bowden',
      'Assassins Creed: Renaissance is the thrilling novelisation by Oliver Bowden based on the game series.',
      'https://images-na.ssl-images-amazon.com/images/I/81E-uQJfEcL.jpg',
      'abc'
    )
  ]
*/

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private _books = new BehaviorSubject<Book[]>([]);
  private _readBooks = new BehaviorSubject<Book[]>([]);
  private _wantToReadBooks = new BehaviorSubject<Book[]>([]);

  get books(){
    // getter that returns copy of private data 
    return this._books.asObservable();
  }

  get readBooks(){
    // getter that returns copy of private data 
    return this._readBooks.asObservable();
  }

  get wantToReadBooks(){
    // getter that returns copy of private data 
    return this._wantToReadBooks.asObservable();
  }

  constructor(
    private http: HttpClient, 
    private authService: AuthService) {
  }

  /* returns observable */
  fetchBooks(){
    return this.http
    .get<{ [key: string]: BookData }>('https://ionic-library-app.firebaseio.com/all-books.json')
    .pipe(
      map(resData => {
        console.log(resData)
        const books = [];
        for(const key in resData){
          if(resData.hasOwnProperty(key)){
            books.push(new Book(
              key, 
              resData[key].title,
              resData[key].author, 
              resData[key].resime, 
              resData[key].imgUrl, 
              resData[key].featured,
              resData[key].rating,
              resData[key].review,
              resData[key].year,
              resData[key].userId
              )
            );
          }
        }
        return books;
      }),
      tap(books => {
        this._books.next(books);
      })
    );
  }

  getFeaturedBook(){
    return this.http
      .get<{ [key: string]: BookData }>('https://ionic-library-app.firebaseio.com/all-books.json')
      .pipe(
        map( resData => {
          for(const key in resData){
            if(resData[key].featured == true){
              return new Book(
                key, 
                resData[key].title, 
                resData[key].author,
                resData[key].resime, 
                resData[key].imgUrl, 
                resData[key].featured,
                resData[key].rating,
                resData[key].review, 
                resData[key].year,
                resData[key].userId);
            }
          }
          return null;
        }
      )
    );
  }

  doesReadBookExists(name: string){
    let localUserId;
    this.authService.userId.subscribe(userId => {
      localUserId = userId;
    })
    return this.http
      .get<{ [key: string]: BookData }>('https://ionic-library-app.firebaseio.com/read-books.json')
      .pipe(
        map( resData => {
          for(const key in resData){
            if(resData[key].userId === localUserId && resData[key].title === name){
              return true;
            }
          }
          return false;
        }
      )
    );
  }

  doesWantToReadBookExists(name: string){
    let localUserId;
    this.authService.userId.subscribe(userId => {
      localUserId = userId;
    })
    return this.http
      .get<{ [key: string]: BookData }>('https://ionic-library-app.firebaseio.com/want-to-read-books.json')
      .pipe(
        map( resData => {
          for(const key in resData){
            if(resData[key].userId === localUserId && resData[key].title === name){
              return true;
            }
          }
          return false;
        }
      )
    );
  }

  doesReviewExists(name: string){
    let localUserId;
    this.authService.userId.subscribe(userId => {
      localUserId = userId;
    })
    return this.http
      .get<{ [key: string]: BookData }>('https://ionic-library-app.firebaseio.com/read-books.json')
      .pipe(
        map( resData => {
          for(const key in resData){
            if(resData[key].userId === localUserId && resData[key].title === name && 
              resData[key].review !== '' && resData[key].rating !== 0){
              return true;
            }
          }
          return false;
        }
      )
    );
  }

  fetchReadBooks(){
    let localUserId;
    this.authService.userId.subscribe(userId => {
      localUserId = userId;
    })
    return this.http
    .get<{ [key: string]: BookData }>('https://ionic-library-app.firebaseio.com/read-books.json')
    .pipe(
      map(resData => {
        console.log(resData)
        const books = [];
        for(const key in resData){
          if(resData.hasOwnProperty(key) && resData[key].userId === localUserId){
            books.push(new Book(
              key, 
              resData[key].title,
              resData[key].author, 
              resData[key].resime, 
              resData[key].imgUrl, 
              resData[key].featured,
              resData[key].rating,
              resData[key].review,
              resData[key].year,
              resData[key].userId
              )
            );
          }
        }
        return books;
      }),
      tap(books => {
        this._readBooks.next(books);
      })
    );
  }

  getReviews(name: string){
    return this.http
    .get<{ [key: string]: BookData }>('https://ionic-library-app.firebaseio.com/read-books.json')
    .pipe(
      map(resData => {
        const reviews = [];
        for(const key in resData){
          if(resData.hasOwnProperty(key) && resData[key].rating > 0 && resData[key].review !== '' && 
              resData[key].title === name){
            reviews.push(new Review(
              resData[key].rating,
              resData[key].review
            ));
          }
        }
        return reviews;
      })
    );
  }

  fetchWantToReadBooks(){
    let localUserId;
    this.authService.userId.subscribe(userId => {
      localUserId = userId;
    })
    return this.http
    .get<{ [key: string]: BookData }>('https://ionic-library-app.firebaseio.com/want-to-read-books.json')
    .pipe(
      map(resData => {
        console.log(resData)
        const books = [];
        for(const key in resData){
          if(resData.hasOwnProperty(key) && resData[key].userId === localUserId){
            books.push(new Book(
              key, 
              resData[key].title,
              resData[key].author, 
              resData[key].resime, 
              resData[key].imgUrl, 
              resData[key].featured,
              resData[key].rating,
              resData[key].review,
              resData[key].year,
              resData[key].userId
              )
            );
          }
        }
        return books;
      }),
      tap(books => {
        this._wantToReadBooks.next(books);
      })
    );
  }

  /* returns observable */
  getBook(id: string){
    return this.http.get<BookData>(
      `https://ionic-library-app.firebaseio.com/all-books/${id}.json`
    ).pipe(
      map(resData => {
        console.log(resData)
        return new Book(
          id, 
          resData.title, 
          resData.author, 
          resData.resime, 
          resData.imgUrl, 
          resData.featured, 
          resData.rating,
          resData.review,
          resData.year,
          resData.userId);
      })
    )
  }

  /* returns observable */
  getReadBook(id: string){
    return this.http.get<BookData>(
      `https://ionic-library-app.firebaseio.com/read-books/${id}.json`
    ).pipe(
      map(resData => {
        return new Book(
          id, 
          resData.title, 
          resData.author, 
          resData.resime, 
          resData.imgUrl, 
          resData.featured,
          resData.rating,
          resData.review, 
          resData.year,
          resData.userId);
      })
    )
  }

  /* returns observable */
  getWantToReadBook(id: string){
    return this.http.get<BookData>(
      `https://ionic-library-app.firebaseio.com/want-to-read-books/${id}.json`
    ).pipe(
      map(resData => {
        return new Book(
          id, 
          resData.title, 
          resData.author, 
          resData.resime, 
          resData.imgUrl, 
          resData.featured, 
          resData.rating,
          resData.review,
          resData.year,
          resData.userId);
      })
    )
  }

  addBook(
    title: string, 
    author: string, 
    resime: string, 
    imgUrl: string, 
    featured: boolean, 
    rating: number, 
    review: string,
    year: number){
    //let generatedId: string;
    let newBook: Book;
    this.authService.userId.subscribe(userId => {
      if(!userId){
        throw new Error('No user id found.');
      }
      newBook = new Book(
        Math.random().toString(), 
        title, 
        author, 
        resime, 
        imgUrl, 
        featured,
        rating,
        review,
        year,
        userId
      );
      this.http
      .post<{name: string}>(
        'https://ionic-library-app.firebaseio.com/all-books.json', 
        { ...newBook, id: null }
      ).subscribe();
    })//, 
    /*switchMap is using for replacing the previous observable chain with a new one using the data
      of the previous one */
    /*switchMap(resData => {
      generatedId = resData.name;
      return this.books;
    }),
    take(1),
    tap(books => {
      newBook.id = generatedId;
      this._books.next(books.concat(newBook));
      })
    );*/
  }

  addReadBook(
    title: string, 
    author: string, 
    resime: string, 
    imgUrl: string, 
    featured: boolean, 
    rating: number, 
    review: string,
    year: number){
    //let generatedId: string;
    let newBook: Book;
    this.authService.userId.subscribe(userId => {
      if(!userId){
        throw new Error('No user id found.');
      }
      newBook = new Book(
        Math.random().toString(), 
        title, 
        author, 
        resime, 
        imgUrl, 
        featured,
        rating,
        review,
        year,
        userId
      );
      this.http
      .post<{name: string}>(
        'https://ionic-library-app.firebaseio.com/read-books.json', 
        { ...newBook, id: null }
      ).subscribe(data => {
        console.log(data)
      });
    })//, 
    /*switchMap is using for replacing the previous observable chain with a new one using the data
      of the previous one */
    /*switchMap(resData => {
      generatedId = resData.name;
      return this.books;
    }),
    take(1),
    tap(books => {
      newBook.id = generatedId;
      this._books.next(books.concat(newBook));
      })
    );*/
  }

  updateReadBook(bookId: string ,rating: number, review: string){
    let updatedBooks: Book[]
    return this.books.pipe(
      take(1),
      switchMap(books => {
        /*if(!books || books.length <= 0){
          return this.fetchReadBooks();
        }else{
          return of(books);
        }*/
        return this.fetchReadBooks();
      }),
      switchMap(books => {
        const updatedBookIndex = books.findIndex(bk => bk.id === bookId);
        updatedBooks = [...books];
        const oldBook = updatedBooks[updatedBookIndex];
        updatedBooks[updatedBookIndex] = new Book(
          oldBook.id,
          oldBook.title,
          oldBook.author,
          oldBook.resime,
          oldBook.imgUrl,
          oldBook.featured,
          rating,
          review,
          oldBook.year,
          oldBook.userId
        );
        return this.http.put(
          `https://ionic-library-app.firebaseio.com/read-books/${bookId}.json`,
          { ...updatedBooks[updatedBookIndex], id: null }
        );
      }),
      tap(() => {
        this._books.next(updatedBooks);
      })
    );
  }

  addWantToReadBook(
    title: string, 
    author: string, 
    resime: string, 
    imgUrl: string, 
    featured: boolean, 
    rating: number, 
    review: string,
    year: number){
    let newBook: Book;
    this.authService.userId.subscribe(userId => {
      if(!userId){
        throw new Error('No user id found.');
      }
      newBook = new Book(
        Math.random().toString(), 
        title, 
        author, 
        resime, 
        imgUrl, 
        featured,
        rating,
        review,
        year,
        userId
      );
      this.http
      .post<{name: string}>(
        'https://ionic-library-app.firebaseio.com/want-to-read-books.json', 
        { ...newBook, id: null }
      ).subscribe();
    })//, 
    /*switchMap is using for replacing the previous observable chain with a new one using the data
      of the previous one */
    /*switchMap(resData => {
      generatedId = resData.name;
      return this.books;
    }),
    take(1),
    tap(books => {
      newBook.id = generatedId;
      this._books.next(books.concat(newBook));
      })
    );*/
  }

  deleteReadBook(bookId: string){
    return this.http.delete(
      `https://ionic-library-app.firebaseio.com/read-books/${bookId}.json`
    ).pipe(switchMap((data) => {
      console.log(data)
      return this.readBooks;
    }), 
    take(1),
    tap(readBooks => {
      this._readBooks.next(readBooks.filter(b => b.id !== bookId));
    }));
  }

  deleteWantToReadBook(bookId: string){
    return this.http.delete(
      `https://ionic-library-app.firebaseio.com/want-to-read-books/${bookId}.json`
    ).pipe(switchMap(() => {
      return this.wantToReadBooks;
    }), 
    take(1),
    tap(wantToReadBooks => {
      this._wantToReadBooks.next(wantToReadBooks.filter(b => b.id !== bookId));
    }));
  }
}
