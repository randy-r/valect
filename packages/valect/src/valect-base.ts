import { VtFieldSet } from './valect.types';

export interface IValueAttacher {
  attach(valectBase: ValectBase): void;
}

export interface ICheckPropagator {
  propagate(valectBase: ValectBase, el: HTMLInputElement): void;
}

const EVENT_OPTIONS: AddEventListenerOptions = { capture: true, passive: true };

const qsa = <E extends Element = Element>(
  el: HTMLElement,
  selectors: string
): NodeListOf<E> => el.querySelectorAll(selectors);

export class ValectBase {
  private _root: VtFieldSet | null = null;
  private hs: {
    listener: any;
    el: HTMLElement;
    type: keyof HTMLElementEventMap;
    options?: boolean | AddEventListenerOptions;
  }[] = [];
  private vas: IValueAttacher[];
  private propag: ICheckPropagator | null;
  private labelsByValue: Record<string, string> = {};

  constructor(
    valueAttachers: IValueAttacher[] = [],
    checkPropag: ICheckPropagator | null = null
  ) {
    this.vas = valueAttachers;
    this.propag = checkPropag;
  }

  get root() {
    if (!this._root) throw new Error('Make sure to call wire.');
    return this._root;
  }

  getAllBoxes() {
    return Array.from(
      qsa(this.root, 'input[type=checkbox], input[type=radio]')
    ) as HTMLInputElement[];
  }

  /** addEventListener */
  public adl<K extends keyof HTMLElementEventMap>(
    element: HTMLElement | undefined | null,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    if (!element) return;
    const opts = options ?? EVENT_OPTIONS;
    element.addEventListener(type, listener, opts);
    this.hs.push({ el: element, listener, type, options: opts });
  }

  toggle() {
    const root = this.root;
    const open = root.getAttribute('data-vt-open');
    root.setAttribute('data-vt-open', open === 'true' ? 'false' : 'true');
  }

  open() {
    const root = this.root;
    root.setAttribute('data-vt-open', 'true');
  }

  close() {
    const root = this.root;
    root.setAttribute('data-vt-open', 'false');
  }

  wire(rootElement: HTMLFieldSetElement) {
    this.unwire();

    this.hs = [];
    this.labelsByValue = {};

    this._root = rootElement as VtFieldSet;

    const root = this.root;

    root.setAttribute('tabIndex', '0');
    root.setAttribute('data-vt-open', 'false');
    root.name = root.name ?? 'vtdefault';

    this.collectLabelsByValue();

    const backdrop = root.querySelector(
      '[data-vt-backdrop]'
    ) as HTMLElement | null;

    const main = this.root.querySelector('[data-vt-main]') as HTMLElement;
    const area = qsa(root, '[data-vt-area')[0] as HTMLElement;
    const selectedArea = qsa(root, '[data-vt-selected-area]')[0] as HTMLElement;
    if (!main || !area)
      throw new Error(
        'Please define a [data-vt-main] & [data-vt-area] element inside [data-vt].'
      );

    // attach the values, but do not upcheck or downcheck because there is no way to tell
    // the correct expected form if an inconsistent one was provided
    for (const va of this.vas) va.attach(this);

    this.paintSelected(selectedArea);

    for (const box of this.getAllBoxes()) {
      box.setAttribute('tabindex', '-1');
    }
    area.setAttribute('tabindex', '-1');

    this.adl(main, 'click', () => {
      this.toggle();
    });

    this.adl(backdrop, 'click', () => {
      this.close();
    });

    let focusIndex = -1;
    this.adl(
      root,
      'keydown',
      (e) => {
        const key = e.key;
        const allBoxes = this.getAllBoxes();
        const open = root.getAttribute('data-vt-open');
        const isOpen = open === 'true';

        if (!allBoxes.length) return;
        if (key === 'ArrowUp' || key === 'ArrowDown') {
          if (!isOpen) return;
          const dir = key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? 1 : 0;
          if (dir === 0) return;

          e.preventDefault();
          const active = document.activeElement;
          // TODO refine

          let currentFocusIndex = allBoxes.findIndex((b) => b === active);
          currentFocusIndex === -1 ? focusIndex : currentFocusIndex;

          let next = focusIndex + dir;
          next = next < 0 ? allBoxes.length - 1 : next;
          focusIndex = next % allBoxes.length;
          allBoxes[focusIndex]?.focus();
        } else if (key === ' ') {
          this.open();
        } else if (key === 'Escape') {
          this.close();
          root.focus();
        } else if (key === 'Enter' || key === 'Tab') {
          if (isOpen) {
            if (key === 'Tab' && e.shiftKey) {
              e.preventDefault();
              this.close();
              root.focus();
              return;
            }

            const active = document.activeElement;
            const targetted: HTMLInputElement | undefined = allBoxes.find(
              (b) => b === active
            );
            if (targetted) {
              // native select does not submit the form on enter, keep it the same here
              e.preventDefault();
              targetted.checked = !targetted.checked;
              targetted.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
          this.close();
          root.focus();
        }
      },
      { capture: true, passive: false }
    );

    this.adl(root, 'change', (e) => {
      const el = e.target as HTMLInputElement;
      this.propag?.propagate(this, el);
      for (const va of this.vas) va.attach(this);
      this.paintSelected(selectedArea);
    });

    this.adl(
      root.form,
      'reset',
      () => {
        // TODO better solution than setTimeout
        setTimeout(() => {
          this.paintSelected(selectedArea);
        }, 10);
      },
      { capture: false, passive: false }
    );
  }
  private collectLabelsByValue() {
    const labels = Array.from(qsa(this.root, 'label')) as HTMLInputElement[];
    this.labelsByValue = labels.reduce((acc, crt) => {
      const forValue = crt.getAttribute('for');
      if (!forValue) return acc;
      const text = Array.from(crt.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join('');
      acc[forValue] = text ? text : forValue;
      return acc;
    }, {} as Record<string, string>);
  }
  private paintSelected(container?: HTMLElement) {
    if (!container) return;
    // checked but not groups
    const boxes = this.getAllBoxes().filter(
      (i) => i.checked && !i.getAttribute('data-vt-groupvalue')
    );

    if (!boxes.length) {
      const placeholder = this.root.getAttribute('aria-placeholder') ?? '...';
      const s = document.createElement('span');
      s.innerHTML = placeholder;
      s.setAttribute('data-vt-placeholder', 'true');
      container.replaceChildren(s);

      return;
    }

    const labels: HTMLSpanElement[] = [];
    for (const box of boxes) {
      const s = document.createElement('span');
      const l = this.labelsByValue[box.id] ?? ''; // TODO support empty/undefined labels ??
      s.innerHTML = l;
      s.setAttribute('data-vt-value', box.value);
      labels.push(s);
    }
    container.replaceChildren(...labels);
  }

  unwire() {
    for (const h of this.hs) {
      h.el.removeEventListener(h.type, h.listener, h.options);
    }
  }
}
