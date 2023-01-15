import { CheckPropagator } from 'valect/src/check-propagation';
import { LinearValueAttacher } from 'valect/src/linear-value';
import { ValectBase } from 'valect/src/valect-base';
import { GroupValueAttacher } from './group-value';

export class Valect extends ValectBase {
  constructor() {
    super(
      [new LinearValueAttacher(), new GroupValueAttacher()],
      new CheckPropagator()
    );
  }
}
