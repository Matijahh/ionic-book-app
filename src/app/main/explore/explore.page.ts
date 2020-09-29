import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../main.service';
import { Book } from '../book.model';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit, OnDestroy {

  searchText: string = '';
  featuredBook: Book;
  listedLoadBooks: Book[];
  private booksSub: Subscription;
  private featuredSub: Subscription;
  isLoaded: boolean = false;

  constructor(private mainService: MainService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.featuredSub = this.mainService.getFeaturedBook().subscribe(featured => {
      this.featuredBook = featured;
    })
    this.booksSub = this.mainService.books.subscribe(books => {
      this.listedLoadBooks = books;
    })
  }

  ionViewWillEnter(){
    this.isLoaded = false;
    this.loadingCtrl.create({
      message: 'Fetching books...'
    }).then(loadingEl => {
      loadingEl.present();
      this.mainService.fetchBooks().subscribe(() => {
        this.isLoaded = true;
        loadingEl.dismiss();
      });
    })
  }

  ngOnDestroy(){
    if(this.booksSub){
      this.booksSub.unsubscribe();
    }
    if(this.featuredSub){
      this.featuredSub.unsubscribe();
    }
  }
}
