import {
  CdkDragDrop,
  CdkDragStart,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  TuiDataListModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import { HeaderComponent } from '../header/header.component';
import { Candidate, Stage } from '../../../../data-access/app.model';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiTextfieldControllerModule,
    TuiSvgModule,
    HeaderComponent,
    CandidateCardComponent
  ],
  templateUrl: './board-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardColumnComponent {
  @Input({ required: true }) column!: { id: string; name: string };
  @Input({ required: true }) list!: Candidate[];
  @Input({ required: true }) connectedIds!: string[];

  @Output() itemsDropped = new EventEmitter<CdkDragDrop<Candidate[]>>();

  get selectedItemsCount() {
    return this.list.filter((item) => item.selected).length;
  }

  dragStarted($event: CdkDragStart<any>) {
    // if (
    //   (
    //     $event.source.dropContainer.data as {
    //       name: string;
    //       selected: boolean;
    //     }[]
    //   ).filter((x) => x.selected).length > 1
    // ) {
    //   this.isMultiMoving = true;
    // }
  }

  drop(event: CdkDragDrop<Candidate[]>) {
    this.itemsDropped.next(event);
  }
}
