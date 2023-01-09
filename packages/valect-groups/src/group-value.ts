import { IValueAttacher, ValectBase } from 'valect/dist/valect-base';
import { VtFieldSet } from 'valect/dist/valect.types';

export type VtGroup = {
  all: boolean;
  group: string;
  value: VtGroupOrValue[];
};

export type VtFlatGroup = {
  all: boolean;
  group: string;
  value: VtGroupOrValue[];
};

export type VtBucket = Record<
  string,
  {
    kids: { input: HTMLInputElement; groupName: string | null }[];
  }
>;

export type VtGroupOrValue = VtGroup | string;

export type VtValue = VtGroup;

const buildVtValueBase = (
  bucket: VtBucket,
  groupName: string
): VtGroup | null => {
  const groupBucket = bucket[groupName];
  if (!groupBucket) return null;
  let checkedCount = 0;
  const value: VtGroupOrValue[] = [];
  for (const k of groupBucket.kids) {
    const checked = k.input.checked;
    if (checked) ++checkedCount;
    if (!k.groupName && checked) {
      value.push(k.input.value);
    } else {
      if (k.groupName) {
        const valueItem = buildVtValueBase(bucket, k.groupName);
        if (valueItem) {
          value.push(valueItem);
        }
      }
    }
  }

  const vtGroup: VtGroup = {
    all: checkedCount === groupBucket.kids.length,
    group: groupName,
    value,
  };

  return vtGroup;
};

const buildVtFlatGroups = (
  bucket: VtBucket,
  _groupName: string
): VtFlatGroup[] | null => {
  const flatGroups: VtFlatGroup[] = [];

  for (const groupKey of Object.keys(bucket)) {
    const group = bucket[groupKey];
    if (!group) continue; // TODO look into this case more in depth
    const valueList = group.kids
      .map((k) => k.input)
      .filter((i) => i.checked)
      .map((i) => i.value);
    const flatGroup: VtFlatGroup = {
      group: groupKey,
      value: valueList,
      all: valueList.length === group.kids.length,
    };

    flatGroups.push(flatGroup);
  }
  return flatGroups;
};

function createBucket(
  allBoxes: HTMLInputElement[],
  rootName: string
): VtBucket {
  const bucket: VtBucket = {
    [rootName]: {
      kids: [],
    },
  };
  for (const box of allBoxes) {
    const parentGroupName = box.getAttribute('data-vt-group') ?? rootName;
    const currentGroupName = box.getAttribute('data-vt-groupvalue');
    if (!parentGroupName) {
      const g = bucket[rootName];
      if (!g) continue; // TODO look into this case more in depth
      g.kids.push({
        input: box,
        groupName: currentGroupName,
      });
    } else {
      if (!bucket[parentGroupName]) {
        bucket[parentGroupName] = {
          kids: [],
        };
      }

      const g = bucket[rootName];
      if (!g) continue; // TODO look into this case more in depth

      g.kids.push({
        input: box,
        groupName: currentGroupName,
      });
    }
  } // for

  return bucket;
}

export type GroupValueVtFieldSet = VtFieldSet & {
  valueAsTreeGroups: () => VtGroup;
  valueAsFlatGroups: () => VtFlatGroup[]; // need to map this
};

export class GroupValueAttacher implements IValueAttacher {
  attach(valectBase: ValectBase): void {
    const root = valectBase.root as GroupValueVtFieldSet;
    let bucket: VtBucket | null;
    let allBoxes: HTMLInputElement[] | null;

    /** init if necessary */
    const init = () => {
      if (!bucket) {
        if (!allBoxes) {
          allBoxes = Array.from(
            root.querySelectorAll('input[type=checkbox]')
          ) as HTMLInputElement[];
        }
        bucket = createBucket(allBoxes, root.name);
      }
      return { bucket, allBoxes };
    };

    root.valueAsTreeGroups = () => {
      const r = init();
      const vtGroup = buildVtValueBase(r.bucket, root.name);
      if (!vtGroup) throw new Error('bad bad');
      return vtGroup;
    };

    root.valueAsFlatGroups = () => {
      const r = init();
      const flatGroups = buildVtFlatGroups(r.bucket, root.name);
      if (!flatGroups) throw new Error('bad bad again');
      return flatGroups;
    };
  }
}
