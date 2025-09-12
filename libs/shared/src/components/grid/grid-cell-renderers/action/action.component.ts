import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  GridFileAction,
  GridFileActionEvent,
  GridFileActionType,
} from '../../../../models';

@Component({
  selector: 'shared-action',
  imports: [CommonModule, TranslocoDirective],
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss',
})
export class ActionComponent {
  @Input() actions!: GridFileAction[];

  @Output() triggerFileAction = new EventEmitter<GridFileActionEvent>();
  @Output() triggerRedirectAction = new EventEmitter<GridFileActionEvent>();

  GridActionType = GridFileActionType;

  onDownloadClick({ url, actionType }: GridFileAction, event?: Event): void {
    let element: HTMLElement | undefined;

    if (
      event &&
      'currentTarget' in event &&
      event.currentTarget instanceof HTMLElement
    ) {
      element = event.currentTarget;
    }
    this.triggerFileAction.emit({
      url,
      actionType,
      element,
    });
  }

  onDeleteClick({ actionType }: GridFileAction): void {
    this.triggerFileAction.emit({
      actionType,
    });
  }

  onRedirectClick({ actionType }: GridFileAction): void {
    this.triggerFileAction.emit({ actionType });
  }
}
