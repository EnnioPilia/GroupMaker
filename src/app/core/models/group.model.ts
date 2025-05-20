import { Person } from './person.model';

export interface Group {
  id: string;
  name: string;
  persons: Person[];
  listName?: string; // <-- ajoute cette ligne

}


export interface List {
  id: string;
  name: string;
  persons: Person[];
  generatedGroups?: Group[];  // <-- ajoute cette propriété
}
