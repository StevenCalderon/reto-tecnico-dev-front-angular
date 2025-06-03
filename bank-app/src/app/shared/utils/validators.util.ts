import { AbstractControl } from "@angular/forms";

export const urlValidator = () => {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  };
}

export const dateNotBeforeTodayValidator = () => {
  return (control: AbstractControl) => {
    if (!control.value) return null;

    const [year, month, day] = control.value.split('-').map(Number);
    const inputUTC = Date.UTC(year, month - 1, day);

    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    return inputUTC >= todayUTC ? null : { dateBeforeToday: true };
  };
}