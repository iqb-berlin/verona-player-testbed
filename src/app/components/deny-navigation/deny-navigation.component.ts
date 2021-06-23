import { Component, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, Validators, FormArray
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-deny-navigation',
  templateUrl: './deny-navigation.component.html',
  styleUrls: ['./deny-navigation.component.scss']
})

export class DenyNavigationComponent {
  @Output() denyNavigation = new EventEmitter<string[]>();
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      reasons: this.formBuilder.array([], [Validators.required])
    });
  }

  onCheckboxChange(event: MatCheckboxChange): void {
    const reasons: FormArray = this.form.get('reasons') as FormArray;
    if (event.checked) {
      reasons.push(new FormControl(event.source.value));
    } else {
      reasons.removeAt(reasons.value.findIndex(
        (item: FormControl): boolean => item.value === event.source.value
      ));
    }
  }

  submit(): void {
    this.denyNavigation.emit(this.form.value.reasons);
  }
}
