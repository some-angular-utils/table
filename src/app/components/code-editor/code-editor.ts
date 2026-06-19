import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.scss',
})
export class CodeEditorComponent {
  code = model.required<string>();
  error = input<string | null>(null);
  filename = input<string>('demo.ts');
  initial = input<string>('');

  lineNumbers = computed(() => {
    const count = this.code().split('\n').length;
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  onInput(value: string) {
    this.code.set(value);
  }

  onScroll(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const gutter = textarea.previousElementSibling as HTMLElement | null;
    if (gutter) gutter.scrollTop = textarea.scrollTop;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    event.preventDefault();

    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const next = `${value.slice(0, start)}  ${value.slice(end)}`;

    this.code.set(next);
    queueMicrotask(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    });
  }

  reset() {
    this.code.set(this.initial());
  }
}
