import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendImageComponent } from './send-image.component';

describe('SendImageComponent', () => {
  let component: SendImageComponent;
  let fixture: ComponentFixture<SendImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
