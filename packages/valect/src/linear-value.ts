import { IValueAttacher, ValectBase } from './valect-base';
import { VtFieldSet, VtForm } from './valect.types';

export type LinearValueVtFieldSet = VtFieldSet & {
  value: string;
  valueAsArray: string[];
};

export class LinearValueAttacher implements IValueAttacher {
  attach(valectBase: ValectBase): void {
    const flatArray = valectBase
      .getAllBoxes()
      .filter((box) => box.checked)
      .map((box) => box.value);

    const root = valectBase.root as LinearValueVtFieldSet;
    root.value = JSON.stringify(flatArray);
    root.valueAsArray = flatArray;

    const form = root.form as VtForm | null;

    valectBase.adl(form, 'formdata', (e) => {
      // only string value in form data
      e.formData.set(root.name, root.value);
    });
  }
}
