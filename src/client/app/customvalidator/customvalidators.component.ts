import { FormControl, FormGroup, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static cannotContainSpace(formControl: FormControl) {
    if (formControl.value.indexOf(' ') >= 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }

  static cannotContainSpecialCharacter(formControl: FormControl) {
    const regex = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;

    if (formControl.value.search(regex) === -1) {
      return null;
    } else {
      return { cannotContainSpecialCharacter: true };
    }
  }

  static passwordsShouldMatch(control: AbstractControl) {
    const password = control.get('password');
    const confirm_password = control.get('confirm_password');

    if (password.value !== confirm_password.value) {
      return { passwordsShouldMatch: true };
    }

    return null;
  }
}
