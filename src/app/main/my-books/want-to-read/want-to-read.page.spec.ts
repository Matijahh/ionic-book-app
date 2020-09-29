import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WantToReadPage } from './want-to-read.page';

describe('WantToReadPage', () => {
  let component: WantToReadPage;
  let fixture: ComponentFixture<WantToReadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WantToReadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WantToReadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
