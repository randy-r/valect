import { CheckPropagator } from './check-propagation';
import { LinearValueAttacher } from './linear-value';
import { ValectBase } from './valect-base';

export class Valect extends ValectBase {
  constructor() {
    super([new LinearValueAttacher()], new CheckPropagator());
  }
}
