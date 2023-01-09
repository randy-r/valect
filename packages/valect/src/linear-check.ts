import { CheckPropagator } from './check-propagation';
import { LinearValueAttacher } from './linear-value';
import { ValectBase } from './valect-base';

export class Valect extends ValectBase {
  constructor(root: HTMLFieldSetElement) {
    super(root, [new LinearValueAttacher()], new CheckPropagator());
  }
}
