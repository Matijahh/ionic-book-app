import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WtrDetailPage } from './wtr-detail.page';

describe('WtrDetailPage', () => {
  let component: WtrDetailPage;
  let fixture: ComponentFixture<WtrDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WtrDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WtrDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
