import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TicketComponent } from '../svgs/ticket/ticket.component';

@Component({
  selector: 'app-check-in-success',
  standalone: true,
  imports: [TicketComponent],
  templateUrl: './check-in-success.component.html',
  styleUrl: './check-in-success.component.scss'
})
export class CheckInSuccessComponent {

  @Input() isOpen = false;
  @Input() attendee: any;
  @Output() close = new EventEmitter<void>();

  confettiItems = Array(50).fill(0).map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 1500,
    color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][
      Math.floor(Math.random() * 6)
    ]
  }));

  onClose() {
    this.close.emit();
  }

}
