import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../main.service';
import { Book } from '../book.model';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
})
export class BookDetailPage implements OnInit, OnDestroy {

  loadedBook: Book;
  private bookSub: Subscription;
  existReadBook: boolean = false;
  existWantToReadBook: boolean = false;
  isLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private mainService: MainService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    public toastController: ToastController) { }

  ngOnInit() {
    this.isLoaded = false;
    this.loadingCtrl.create({
      message: 'Fetching book...'
    }).then(loadingEl => {
      loadingEl.present();
      this.route.paramMap.subscribe(paramMap => {
        if(!paramMap.has('bookId')){
          this.navCtrl.navigateBack('/main/tabs/explore');
          return;
        }
        this.bookSub = this.mainService.getBook(paramMap.get('bookId')).subscribe(book => {
          this.loadedBook = book;
          this.isLoaded = true;
          
          this.mainService.doesReadBookExists(this.loadedBook.title).subscribe(
            data => {
              this.existReadBook = data;
            }
          );

          this.mainService.doesWantToReadBookExists(this.loadedBook.title).subscribe(
            data => {
              this.existWantToReadBook = data;
            }
          );

          loadingEl.dismiss();
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!', 
            message: 'Books could not be fetched. Please try again later.', 
            buttons: [{text: 'OK', handler: () => {
              this.router.navigate(['/main/tabs/explore']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
        });
      })
    })
  }

  async read(){
    const toast = await this.toastController.create({
      message: 'This book awaits you in your already read list.',
      duration: 2000
    });

    let bookExists = false;
    this.mainService.doesWantToReadBookExists(this.loadedBook.title).subscribe(
      data => {
        if(data){
          this.alertCtrl.create({
            header: 'An error occured!', 
            message: 'This book already exists in your want to read list.', 
            buttons: [{text: 'OK', handler: () => {
              this.router.navigate(['/main/tabs/my-books/want-to-read']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
          bookExists = true;
        }
        if(!bookExists){
          this.mainService.addReadBook(
            this.loadedBook.title,
            this.loadedBook.author,
            this.loadedBook.resime,
            this.loadedBook.imgUrl,
            this.loadedBook.featured,
            this.loadedBook.rating,
            this.loadedBook.review,
            this.loadedBook.year
          );
          toast.present();
        }
      }
    );
  }

  async wantToRead(){
    const toast = await this.toastController.create({
      message: 'This book awaits you in your book to read list.',
      duration: 2000
    });

    let bookExists = false;
    this.mainService.doesReadBookExists(this.loadedBook.title).subscribe(
      data => {
        if(data){
          this.alertCtrl.create({
            header: 'An error occured!', 
            message: 'This book already exists in your already read list.', 
            buttons: [{text: 'OK', handler: () => {
              this.router.navigate(['/main/tabs/my-books/read']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
          bookExists = true;
        }
        if(!bookExists){
          this.mainService.addWantToReadBook(
            this.loadedBook.title,
            this.loadedBook.author,
            this.loadedBook.resime,
            this.loadedBook.imgUrl,
            this.loadedBook.featured,
            this.loadedBook.rating,
            this.loadedBook.review,
            this.loadedBook.year
          );
          toast.present();
        }
      }
    );
  }

  ngOnDestroy(){
    if(this.bookSub){
      this.bookSub.unsubscribe();
    }
  }
}
