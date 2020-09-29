import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/main/book.model';
import { MainService } from 'src/app/main/main.service';
import { NgForm } from '@angular/forms';
import { Review } from 'src/app/main/review.model';

@Component({
  selector: 'app-read-book-detail',
  templateUrl: './read-book-detail.page.html',
  styleUrls: ['./read-book-detail.page.scss'],
})
export class ReadBookDetailPage implements OnInit, OnDestroy {

  loadedBook: Book;
  private bookSub: Subscription;
  private updateBookSub: Subscription;
  isLoaded: boolean = false;
  doesReviewExists: boolean = false;
  loadedReviews: Review[] = [];

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
        if(!paramMap.has('readBookId')){
          this.navCtrl.navigateBack('/main/tabs/my-books/read');
          return;
        }
        this.bookSub = this.mainService.getReadBook(paramMap.get('readBookId')).subscribe(book => {
          this.loadedBook = book;
          this.isLoaded = true;
          this.mainService.doesReviewExists(this.loadedBook.title).subscribe(
            data => {
              this.doesReviewExists = data;
            }
          );
          this.mainService.getReviews(this.loadedBook.title).subscribe(
            data => {
              this.loadedReviews = data;
            }
          )
          loadingEl.dismiss();
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!', 
            message: 'Books could not be fetched. Please try again later.', 
            buttons: [{text: 'OK', handler: () => {
              this.router.navigate(['/main/tabs/my-books/read']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
        });
      })
    })
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating book...'
    }).then(loadingEl => {
      loadingEl.present();
      this.mainService.updateReadBook(
        this.loadedBook.id,
        form.value.rating,
        form.value.review
      ).subscribe(() => {
        loadingEl.dismiss();
        form.reset();
        this.router.navigate(['/main/tabs/my-books/read']);
      })
    })
  }

  ngOnDestroy(){
    if(this.bookSub){
      this.bookSub.unsubscribe();
    }
    if(this.updateBookSub){
      this.updateBookSub.unsubscribe();
    }
  }

}
