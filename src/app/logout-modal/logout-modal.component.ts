import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [],
  templateUrl: './logout-modal.component.html',
  styleUrl: './logout-modal.component.scss'
})
export class LogoutModalComponent {
  @Input() isOpen = false;
  @Input() attendeeName = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

}
