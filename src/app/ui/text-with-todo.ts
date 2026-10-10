import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { TranslationKey } from '../i18n/dictionary';
import { I18n } from '../i18n/i18n';

type Part = { readonly text: string } | { readonly todo: string };

/**
 * Renders a dictionary string whose {placeholders} may not be known yet.
 * A null value shows a visible TODO badge instead of a guess
 * (business-requirements §3), e.g. "Stall [TODO T1] · Han Market".
 */
@Component({
  selector: 'app-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (part of parts(); track $index) {@if ('todo' in part) {<span class="todo">TODO {{ part.todo }}</span>} @else {{{ part.text }}}}`,
})
export class TextWithTodo {
  private readonly i18n = inject(I18n);
  readonly key = input.required<TranslationKey>();
  readonly values = input<Record<string, string | number | null>>({});
  /** Badge label per placeholder, e.g. { stall: 'T1 stall number' }. */
  readonly todo = input<Record<string, string>>({});

  protected readonly parts = computed<Part[]>(() =>
    this.i18n
      .t(this.key())
      .split(/(\{\w+\})/)
      .filter(Boolean)
      .map((chunk) => {
        const name = /^\{(\w+)\}$/.exec(chunk)?.[1];
        if (!name) return { text: chunk };
        const value = this.values()[name];
        return value === null || value === undefined
          ? { todo: this.todo()[name] ?? name }
          : { text: String(value) };
      }),
  );
}
