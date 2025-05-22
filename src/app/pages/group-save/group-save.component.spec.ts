import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSaveComponent } from './group-save.component';

describe('GroupSaveComponent', () => {
  let component: GroupSaveComponent;
  let fixture: ComponentFixture<GroupSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupSaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
