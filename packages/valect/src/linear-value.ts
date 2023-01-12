import { IValueAttacher, ValectBase } from './valect-base';
import { VtFieldSet as VtFieldSetBase, VtForm } from './valect.types';

export type VtFieldSet = VtFieldSetBase & {
  value: string;
  valueAsArray: string[];
};

export class LinearValueAttacher implements IValueAttacher {
  attach(valectBase: ValectBase): void {
    const flatArray = valectBase
      .getAllBoxes()
      .filter((box) => box.checked)
      .map((box) => box.value);

    const root = valectBase.root as VtFieldSet;
    root.value = JSON.stringify(flatArray);
    root.valueAsArray = flatArray;

    const form = root.form as VtForm | null;

    valectBase.adl(form, 'formdata', (e) => {
      // only string value in form data
      e.formData.set(root.name, root.value);
    });
  }
}
