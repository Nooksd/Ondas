import { Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class ModalService {
  lastResult = signal<boolean | null>(null);

  async confirm(
    title = 'Confirmação',
    text = 'Tem certeza que deseja continuar?',
    confirmText = 'Sim',
    cancelText = 'Não'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      iconColor: '#cc3300',
      showCancelButton: true,
      color: '#176dc6',
      confirmButtonText: confirmText,
      confirmButtonColor: '#176dc6',
      cancelButtonText: cancelText,
      cancelButtonColor: '#cc3300',
      allowOutsideClick: false,
      reverseButtons: true,
      focusCancel: true,
    });

    const ok = !!result.isConfirmed;
    this.lastResult.set(ok);
    return ok;
  }
}
