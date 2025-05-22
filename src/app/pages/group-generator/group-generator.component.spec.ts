import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupGeneratorComponent } from './group-generator.component';
import { GroupGeneratorService } from '../../core/group-generator.service';
import { ListService } from '../../core/list.services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GroupGeneratorComponent', () => {
  let component: GroupGeneratorComponent;
  let fixture: ComponentFixture<GroupGeneratorComponent>;
  let listServiceStub: any;
  let groupServiceStub: any;

  beforeEach(async () => {
    // Stub des listes et personnes avec generatedGroups initialisé
    listServiceStub = {
      getLists: () => [
        {
          id: 'list-1',
          persons: [
            { id: '1', lastName: 'Doe', age: 25, isFormerDwwm: false },
            { id: '2', lastName: 'Smith', age: 30, isFormerDwwm: true },
          ],
          groupNames: [],
          generatedGroups: [] // important pour éviter undefined
        }
      ]
    };

    // Mock du service de génération de groupes
    groupServiceStub = {
      generateGroups: jasmine.createSpy('generateGroups').and.callFake((persons: any[], numberOfGroups: number) => {
        return [
          [persons[0]], // groupe 1
          [persons[1]]  // groupe 2
        ];
      })
    };

    await TestBed.configureTestingModule({
      imports: [GroupGeneratorComponent],
      providers: [
        { provide: ListService, useValue: listServiceStub },
        { provide: GroupGeneratorService, useValue: groupServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher une erreur s’il n’y a pas assez de personnes', () => {
    component.numberOfGroups = 3;
    component.generateForList('list-1');
    expect(component.errorMessage).toBe('Pas assez de personnes pour former autant de groupes.');
  });

it('devrait générer des groupes sans critère', () => {
  component.numberOfGroups = 2;
  component.criteria = { mixerAge: false, mixerAncienDwwm: false };

  // Assure-toi que la liste est dans component.lists
  component.lists = listServiceStub.getLists();

  component.generateForList('list-1');

  const list = component.lists.find(l => l.id === 'list-1');

  if (!list) {
    fail('La liste est introuvable');
    return;
  }
  if (!list.generatedGroups) {
    fail('generatedGroups est undefined');
    return;
  }

  expect(list.generatedGroups.length).toBe(2);
  expect(component.errorMessage).toBe('');
});


  it('devrait sauvegarder l’historique dans localStorage', () => {
    const listId = 'list-1';
    spyOn(localStorage, 'setItem').and.callThrough();

    component.numberOfGroups = 2;
    component.generateForList(listId);

    expect(localStorage.setItem).toHaveBeenCalled();
    const history = JSON.parse(localStorage.getItem(`groups-${listId}`) || '[]');
    expect(history.length).toBeGreaterThan(0);
  });

  it('devrait appeler reload() de groupHistoryComponent après génération', () => {
    const mockReload = jasmine.createSpy('reload');
    component.groupHistoryComponent = { reload: mockReload } as any;

    component.numberOfGroups = 2;
    component.generateForList('list-1');
    expect(mockReload).toHaveBeenCalled();
  });
});
