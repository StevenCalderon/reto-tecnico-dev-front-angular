export const urlValidator = () => {
  return (control: any) => {
    if (!control.value) return null; // No valida si está vacío (eso lo hace 'required')
    try {
      new URL(control.value);
      return null; // Es una URL válida
    } catch {
      return { invalidUrl: true };
    }
  };
}
