import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../main.service';
import { Book } from '../../book.model';
import { Subscription } from 'rxjs';
import { LoadingController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-read',
  templateUrl: './read.page.html',
  styleUrls: ['./read.page.scss'],
})
export class ReadPage implements OnInit, OnDestroy {

  loadedBooks: Book[];
  private booksSub: Subscription;
  isLoaded: boolean = false;

  constructor(private mainService: MainService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.booksSub = this.mainService.readBooks.subscribe(books => {
      this.loadedBooks = books;
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
    })
  }

  /* Creating book method
  
  onCreateBook(){
    if(this.form.valid){
      return;
    }
    this.loadingCtrl.create({
      message: 'Creating book...'
    }).then(loadingEl => {
      loadingEl.present();
      this.mainService.addBook(
        this.form.title,
        this.form.author,
        this.form.resime
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/main/tabs/my-books'])
      });
    })
  }
  */

  onDelete(bookId: string, slidingItem: IonItemSliding){
    slidingItem.close();
    this.loadingCtrl.create({message: 'Deleting book...'}).then(loadingEl => {
      loadingEl.present();
      this.mainService.deleteReadBook(bookId).subscribe(() => {
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
