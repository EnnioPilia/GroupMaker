import { Person } from './person.model';

export interface Group {
  id: string;
  name: string;
  persons: Person[];
  listName?: string; // <-- ajoute cette ligne

}