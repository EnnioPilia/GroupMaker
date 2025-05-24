import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group } from '../../core/models/group.model';

@Component({
  selector: 'app-group-history',
  imports: [CommonModule],
  templateUrl: './group-history.component.html',
  styleUrls: ['./group-history.component.css'],
})
export class GroupHistoryComponent implements OnInit {
  @Input() listId: string | null = null;
  storedGroupHistory: Group[][] = [];
  @Input() listName: string = '';

  ngOnInit(): void {
    this.loadHistory();
  }
  reload(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    if (!this.listId) return;

    const stored = localStorage.getItem(`groups-${this.listId}`);

    try {
      const parsed = JSON.parse(stored || '[]');
      if (
        Array.isArray(parsed) &&
        parsed.every((tirage) => Array.isArray(tirage))
      ) {
        this.storedGroupHistory = parsed;
      } else {
        console.warn(`Format invalide dans localStorage pour ${this.listId}`);
      }
    } catch (error) {
      console.error(
        `Erreur de parsing de l'historique pour ${this.listId}`,
        error
      );
    }
  }
deleteTirage(indexToDelete: number): void {
  if (!this.listId) return;

  const updatedHistory = [...this.storedGroupHistory];

  updatedHistory.splice(indexToDelete, 1);

  this.storedGroupHistory = updatedHistory;

  localStorage.setItem(
    `groups-${this.listId}`,
    JSON.stringify(this.storedGroupHistory)
  );

  console.log(`Tirage #${indexToDelete + 1} supprimé`);  // debug
}


}
