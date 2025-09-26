import { Injectable, signal } from '@angular/core';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
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

  async promptPassword(
    title = 'Alterar senha',
    confirmText = 'Salvar',
    cancelText = 'Cancelar'
  ): Promise<string | null> {
    const result = await Swal.fire({
      title,
      input: 'text',
      inputLabel: 'Nova senha',
      inputPlaceholder: 'Digite a nova senha',
      iconColor: '#cc3300',
      showCancelButton: true,
      color: '#176dc6',
      confirmButtonText: confirmText,
      confirmButtonColor: '#176dc6',
      cancelButtonText: cancelText,
      cancelButtonColor: '#cc3300',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off',
        autocomplete: 'new-password',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'A senha não pode estar vazia!';
        }
        if (value.length < 6) {
          return 'A senha deve ter pelo menos 6 caracteres!';
        }
        if (!/[A-Z]/.test(value)) {
          return 'A senha deve conter pelo menos uma letra maiúscula!';
        }
        if (!/[a-z]/.test(value)) {
          return 'A senha deve conter pelo menos uma letra minúscula!';
        }
        if (!/[0-9]/.test(value)) {
          return 'A senha deve conter pelo menos um número!';
        }
        if (!/[^A-Za-z0-9]/.test(value)) {
          return 'A senha deve conter pelo menos um caractere especial!';
        }
        return null;
      },
      allowOutsideClick: false,
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed && result.value) {
      return result.value as string;
    }
    return null;
  }

  async selectOption(
    options: string[],
    title = 'Selecione uma opção',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
  ): Promise<string | null> {
    const inputOptions = options.reduce((acc, curr) => {
      acc[curr] = curr;
      return acc;
    }, {} as Record<string, string>);

    const result = await Swal.fire({
      title,
      input: 'select',
      inputOptions,
      inputPlaceholder: 'Escolha uma opção',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonColor: '#cc3300',
      confirmButtonColor: '#176dc6',
      color: '#176dc6',
      cancelButtonText: cancelText,
      allowOutsideClick: false,
      reverseButtons: true,
      focusCancel: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Selecione uma opção!';
        }
        return null;
      },
    });

    if (result.isConfirmed && result.value) {
      return result.value as string;
    }
    return null;
  }

  async pickDate(
    title = 'Selecionar data',
    confirmText = 'OK',
    cancelText = 'Cancelar',
    initialDate?: Date
  ): Promise<Date | null> {
    let fpInstance: any = null;

    const result = await Swal.fire({
      title,
      html: `<input id="swal-datepicker" type="text" class="swal2-input" style="min-width:180px" />`,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      cancelButtonColor: '#cc3300',
      confirmButtonColor: '#176dc6',
      color: '#176dc6',
      allowOutsideClick: false,
      reverseButtons: true,
      focusCancel: true,
      didOpen: () => {
        const el = document.getElementById('swal-datepicker') as HTMLInputElement | null;
        if (!el) return;
        fpInstance = flatpickr(el, {
          locale: Portuguese,
          dateFormat: 'd/m/Y',
          defaultDate: initialDate ?? new Date(),
          allowInput: true,
        });
      },
      preConfirm: () => {
        if (!fpInstance) {
          Swal.showValidationMessage('Erro ao abrir o seletor de data.');
          return null;
        }
        const sel: Date | undefined = fpInstance.selectedDates?.[0];
        if (!sel) {
          Swal.showValidationMessage('Selecione uma data!');
          return null;
        }
        return sel.toISOString();
      },
      willClose: () => {
        if (fpInstance) {
          fpInstance.destroy();
          fpInstance = null;
        }
      },
    });

    if (result.isConfirmed && result.value) {
      try {
        return new Date(result.value as string);
      } catch {
        return null;
      }
    }
    return null;
  }
}
