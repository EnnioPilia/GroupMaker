import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Group } from '../../core/models/group.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-save',
  standalone: true,
  templateUrl: './group-save.component.html',
  styleUrls: ['./group-save.component.css'],
  imports: [CommonModule, FormsModule]
})
export class GroupSaveComponent implements OnChanges {
  @Input() groups: Group[] = [];
  @Output() save = new EventEmitter<Group[]>();

  groupNames: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groups'] && this.groups) {
      this.groupNames = this.groups.map(g => g.name);
    }
  }

  onSave() {
    this.groups.forEach((group, i) => {
      if (this.groupNames[i]) {
        group.name = this.groupNames[i];
      }
    });
    this.save.emit(this.groups);
  }
}
