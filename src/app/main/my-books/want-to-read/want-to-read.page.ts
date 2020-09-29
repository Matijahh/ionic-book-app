import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../main.service';
import { Book } from '../../book.model';
import { Subscription } from 'rxjs';
import { LoadingController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-want-to-read',
  templateUrl: './want-to-read.page.html',
  styleUrls: ['./want-to-read.page.scss'],
})
export class WantToReadPage implements OnInit, OnDestroy {

  loadedBooks: Book[];
  private booksSub: Subscription;
  isLoaded: boolean = false;

  constructor(private mainService: MainService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.booksSub = this.mainService.wantToReadBooks.subscribe(books => {
      this.loadedBooks = books;
    })
  }

  ionViewWillEnter(){
    this.isLoaded = false;
    this.loadingCtrl.create({
      message: 'Fetching books...'
    }).then(loadingEl => {
      loadingEl.present();
      this.mainService.fetchWantToReadBooks().subscribe(() => {
        this.isLoaded = true;
        loadingEl.dismiss();
      });
    })
  }

  onDelete(bookId: string, slidingItem: IonItemSliding){
    slidingItem.close();
    this.loadingCtrl.create({message: 'Deleting book...'}).then(loadingEl => {
      loadingEl.present();
      this.mainService.deleteWantToReadBook(bookId).subscribe(() => {
        loadingEl.dismiss();
      });
    })
  }

  ngOnDestroy(){
    if(this.booksSub){
      this.booksSub.unsubscribe();
    }
  }
}
