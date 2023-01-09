import { CheckPropagator } from 'valect/dist/check-propagation';
import { LinearValueAttacher } from 'valect/dist/linear-value';
import { ValectBase } from 'valect/dist/valect-base';
import { GroupValueAttacher } from './group-value';

export class Valect extends ValectBase {
  constructor(root: HTMLFieldSetElement) {
    super(
      root,
      [new LinearValueAttacher(), new GroupValueAttacher()],
      new CheckPropagator()
    );
  }
}
