import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyBooksPage } from './my-books.page';

describe('MyBooksPage', () => {
  let component: MyBooksPage;
  let fixture: ComponentFixture<MyBooksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBooksPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyBooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
