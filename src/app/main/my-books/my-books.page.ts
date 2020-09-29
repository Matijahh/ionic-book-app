import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../book.model';
import { MainService } from '../main.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.page.html',
  styleUrls: ['./my-books.page.scss'],
})
export class MyBooksPage implements OnInit, OnDestroy {

  loadedReadBooks: Book[] = [];
  loadedWantToReadBooks: Book[] = [];
  private readBooksSub: Subscription;
  private wantToReadBooksSub: Subscription;
  isLoaded: boolean = false;

  constructor(
    private mainService: MainService, 
    private router:Router, 
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.readBooksSub = this.mainService.readBooks.subscribe(books => {
      this.loadedReadBooks = books;
    })
    this.wantToReadBooksSub = this.mainService.wantToReadBooks.subscribe(books => {
      this.loadedWantToReadBooks = books;
    })
  }

  ionViewWillEnter(){
    this.isLoaded = false;
    this.loadingCtrl.create({
      message: 'Fetching books...'
    }).then(loadingEl => {
      loadingEl.present();
      this.mainService.fetchReadBooks().subscribe(() => {
        this.isLoaded = true;
        loadingEl.dismiss();
      });
      this.mainService.fetchWantToReadBooks().subscribe(() => {
        this.isLoaded = true;
        loadingEl.dismiss();
      });
    })
  }

  onGoRead(){
    this.router.navigateByUrl('/main/tabs/my-books/read');
  }

  onGoWantToRead(){
    this.router.navigateByUrl('/main/tabs/my-books/want-to-read');
  }

  ngOnDestroy(){
    if(this.readBooksSub){
      this.readBooksSub.unsubscribe();
    }
    if(this.wantToReadBooksSub){
      this.wantToReadBooksSub.unsubscribe();
    }
  }

}
