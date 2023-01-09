import { ValectBase } from './valect-base';
import { VtFieldSet } from './valect.types';

const qsa = <E extends Element = Element>(
  el: HTMLElement,
  selectors: string
): NodeListOf<E> => el.querySelectorAll(selectors);

export class CheckPropagator {
  private downCheck(el: HTMLInputElement, root: VtFieldSet) {
    const currentGroupName = el.getAttribute('data-vt-groupvalue');
    if (currentGroupName) {
      const kids = Array.from(
        qsa(root, `[data-vt-group="${currentGroupName}"]`)
      ) as HTMLInputElement[];
      const parentChecked = el.checked;
      for (const kid of kids) {
        kid.checked = parentChecked;
        this.downCheck(kid, root);
      }
    }
  }

  private upCheck(el: HTMLInputElement, root: VtFieldSet) {
    const parentGroupName = el.getAttribute('data-vt-group');
    if (parentGroupName) {
      const parentGroup = root.querySelector(
        `[data-vt-groupvalue="${parentGroupName}"]`
      ) as HTMLInputElement;
      if (parentGroup) {
        const siblings = Array.from(
          qsa(root, `[data-vt-group="${parentGroupName}"]`)
        ) as HTMLInputElement[];
        const checkedSiblings = siblings.filter((s) => s.checked);
        parentGroup.checked = siblings.length === checkedSiblings.length;
        this.upCheck(parentGroup, root);
      }
    }
  }

  propagate(valectBase: ValectBase, el: HTMLInputElement): void {
    this.downCheck(el, valectBase.root);
    this.upCheck(el, valectBase.root);
  }
}
