import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-check-in-modal',
  standalone: true,
  imports: [],
  templateUrl: './check-in-modal.component.html',
  styleUrl: './check-in-modal.component.scss'
})
export class CheckInModalComponent {
  @Input() isOpen = false;
  @Input() attendeeName = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

}
