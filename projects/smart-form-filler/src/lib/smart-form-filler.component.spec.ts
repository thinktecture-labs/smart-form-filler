import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartFormFillerComponent } from './smart-form-filler.component';

describe('SmartFormFillerComponent', () => {
  let component: SmartFormFillerComponent;
  let fixture: ComponentFixture<SmartFormFillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartFormFillerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmartFormFillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
