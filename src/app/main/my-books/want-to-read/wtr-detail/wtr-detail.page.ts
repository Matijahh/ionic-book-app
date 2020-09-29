import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/main/book.model';
import { MainService } from 'src/app/main/main.service';

@Component({
  selector: 'app-wtr-detail',
  templateUrl: './wtr-detail.page.html',
  styleUrls: ['./wtr-detail.page.scss'],
})
export class WtrDetailPage implements OnInit, OnDestroy {

  loadedBook: Book;
  private bookSub: Subscription;
  isLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private mainService: MainService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.isLoaded = false;
    this.loadingCtrl.create({
      message: 'Fetching book...'
    }).then(loadingEl => {
      loadingEl.present();
      this.route.paramMap.subscribe(paramMap => {
        if(!paramMap.has('wtrBookId')){
          this.navCtrl.navigateBack('/main/tabs/my-books/want-to-read');
          return;
        }
        this.bookSub = this.mainService.getWantToReadBook(paramMap.get('wtrBookId')).subscribe(book => {
          this.loadedBook = book;
          this.isLoaded = true;
          loadingEl.dismiss();
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!', 
            message: 'Books could not be fetched. Please try again later.', 
            buttons: [{text: 'OK', handler: () => {
              this.router.navigate(['/main/tabs/my-books/want-to-read']);
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
    this.mainService.doesReadBookExists(this.loadedBook.title).subscribe(
      data => {
        if(data){
          this.alertCtrl.create({
            header: 'An error occured!', 
            message: 'This book already exists in your read books list.', 
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
          this.mainService.deleteWantToReadBook(this.loadedBook.id).subscribe();
          toast.present();
          this.router.navigate(['/main/tabs/my-books/want-to-read']);
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
