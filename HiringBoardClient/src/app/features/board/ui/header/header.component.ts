import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  TuiButtonModule,
  TuiRootModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiInputModule, TuiSelectModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TuiRootModule,
    TuiInputModule,
    FormsModule,
    TuiSelectModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styles: `
    tui-input input {
      @apply bg-gray-200;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  control = inject(FormBuilder).control('');
  text = '';
}
