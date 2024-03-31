import {
  CdkDragDrop,
  CdkDragStart,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TuiDataListModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import { Candidate, Stage } from '../../data-access/app.model';
import { BoardColumnComponent } from './ui/board-column/board-column.component';
import { HeaderComponent } from './ui/header/header.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiTextfieldControllerModule,
    TuiSvgModule,
    HeaderComponent,
    BoardColumnComponent
  ],
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  isMultiMoving = false;

  stages: Stage[] = [
    { id: '1', name: 'To do' },
    { id: '2', name: 'Done' }
  ];

  lists: { [key: string]: Candidate[] } = {
    '1': [
      { id: '1', name: 'Episode I - The Phantom Menace', selected: true },
      { id: '2', name: 'Episode II - Attack of the Clones', selected: true },
      { id: '3', name: 'Episode III - Revenge of the Sith', selected: true }
    ],
    '2': [
      { id: '4', name: 'Episode IV - A New Hope', selected: false },
      { id: '5', name: 'Episode V - The Empire Strikes Back', selected: false },
      { id: '6', name: 'Episode VI - Return of the Jedi', selected: false },
      { id: '7', name: 'Episode VII - The Force Awakens', selected: false },
      { id: '8', name: 'Episode VIII - The Last Jedi', selected: false },
      { id: '9', name: 'Episode IX – The Rise of Skywalker', selected: false }
    ]
  };

  getList(id: string) {
    if (id in this.lists) {
      return this.lists[id as keyof typeof this.lists];
    }
    return [];
  }

  drop(event: CdkDragDrop<Candidate[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const previousContainerData = event.previousContainer.data;
      const containerData = event.container.data;
      const selectedItems = previousContainerData.filter(
        (item) => item.selected
      );

      if (selectedItems.length > 0) {
        // Move all selected items
        selectedItems.forEach((item) => {
          const index = previousContainerData.indexOf(item);
          if (index !== -1) {
            transferArrayItem(
              previousContainerData,
              containerData,
              index,
              event.currentIndex
            );
          }
        });
        // Deselect items after moving
      } else {
        // Move single item logic if no items are selected
        transferArrayItem(
          previousContainerData,
          containerData,
          event.previousIndex,
          event.currentIndex
        );
      }
    }

    this.isMultiMoving = false;
    // [Array.from(this.lists.values())].forEach((list) =>
    //   list.forEach((item) => (item.selected = false))
    // );
  }
}
