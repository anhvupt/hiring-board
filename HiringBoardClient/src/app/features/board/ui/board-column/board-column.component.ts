import {
  CdkDragDrop,
  CdkDragStart,
  DragDropModule
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
import { CandidateBoardView } from '~/data-access/app.model';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';

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
    CandidateCardComponent,
    RouterLink
  ],
  templateUrl: './board-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardColumnComponent {
  @Input({ required: true }) column!: { id: number; name: string };
  @Input({ required: true }) list!: CandidateBoardView[];
  @Input({ required: true }) connectedIds: string[] = [];

  @Output() itemsDropped = new EventEmitter<
    CdkDragDrop<CandidateBoardView[]>
  >();

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

  drop(event: CdkDragDrop<CandidateBoardView[]>) {
    this.itemsDropped.next(event);
  }
}
