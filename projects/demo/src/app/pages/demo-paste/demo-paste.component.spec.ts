import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoPasteComponent } from './demo-paste.component';

describe('DemoPasteComponent', () => {
  let component: DemoPasteComponent;
  let fixture: ComponentFixture<DemoPasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoPasteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoPasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
