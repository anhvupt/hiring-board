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
import { RouterLink } from '@angular/router';
import {
  TuiDataListModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import { CandidateBoardView, Stage } from '~/data-access/app.model';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';
import { HeaderComponent } from '../header/header.component';

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
  @Input({ required: true }) connectedList: Stage[] = [];

  @Output() itemsDropped = new EventEmitter<
    CdkDragDrop<CandidateBoardView[]>
  >();

  get selectedItemsCount() {
    return this.list.filter((item) => item.selected).length;
  }

  get connectedIds() {
    return this.connectedList.map((x) => String(x.id));
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

  dropped(event: CdkDragDrop<CandidateBoardView[]>) {
    // if (!(event.isPointerOverContainer && event.item.data.source)) {
    //   return;
    // }
    this.itemsDropped.next(event);
  }
}
