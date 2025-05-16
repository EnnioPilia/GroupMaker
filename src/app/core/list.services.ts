import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Person {
  // On complétera plus tard
}

export interface List {
  id: string;
  name: string;
  persons: Person[];
  draws: number;
}

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private storageKey = 'groupmaker_lists';

  // Comportement observable pour les listes
  private listsSubject = new BehaviorSubject<List[]>(this.loadLists());
  lists$ = this.listsSubject.asObservable();

  private loadLists(): List[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private saveLists(lists: List[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(lists));
    this.listsSubject.next(lists);
  }

  getLists(): List[] {
    return this.listsSubject.value;
  }

  addList(name: string): boolean {
    const lists = this.getLists();

    if (lists.find(l => l.name.toLowerCase() === name.toLowerCase())) {
      return false; // nom déjà utilisé
    }

    const newList: List = {
      id: crypto.randomUUID(),
      name,
      persons: [],
      draws: 0
    };

    lists.push(newList);
    this.saveLists(lists);
    return true;
  }

  deleteList(id: string) {
    const lists = this.getLists().filter(l => l.id !== id);
    this.saveLists(lists);
  }

  updateList(id: string, newName: string): boolean {
    const lists = this.getLists();
    const listToUpdate = lists.find(l => l.id === id);
    if (!listToUpdate) return false;

    if (lists.some(l => l.name.toLowerCase() === newName.toLowerCase() && l.id !== id)) {
      return false; // nom déjà utilisé
    }

    listToUpdate.name = newName;
    this.saveLists(lists);
    return true;
  }
}
