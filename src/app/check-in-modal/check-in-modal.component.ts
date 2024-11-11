import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface CheckInData {
  type: 'female' | 'male';
}

@Component({
  selector: 'app-check-in-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './check-in-modal.component.html',
  styleUrl: './check-in-modal.component.scss'
})
export class CheckInModalComponent {
  @Input() isOpen = false;
  @Input() attendeeName = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() checkInType = new EventEmitter<any>();
  isFemale = signal(false);
  isMale = signal(false);


  onConfirm() {
    let type: CheckInData['type'] = 'female';
    if (this.isFemale()) type = 'female';
    else if (this.isMale()) type = 'male';
    this.checkInType.emit({ type });
    this.confirm.emit();
    this.isFemale.set(false);
    this.isMale.set(false);
  }


  updateFemale(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isFemale.set(checkbox.checked);
    this.checkInType.emit('female');
    this.isMale.set(false);


  }

  updateMale(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isMale.set(checkbox.checked);
    this.checkInType.emit('male');
    this.isFemale.set(false);

  }

}
