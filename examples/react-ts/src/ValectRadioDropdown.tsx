import { useEffect, useRef, useState } from 'react';
import { Valect } from 'valect/src/index';
import { VtFieldSet } from 'valect/src/linear-value';


export function ValectRadioDropdown() {
  const [selected, setSelected] = useState();
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    const fieldset = fieldsetRef.current;
    if (!fieldset) return;

    const valect = new Valect();
    valect.wire(fieldset);

    return () => {
      valect.unwire();
    };
  }, []);

  return (
    <fieldset
      ref={fieldsetRef}
      aria-placeholder="Select..."
      name="myRadioSelect"
      role="combobox checkbox"
      tabIndex={0}
      data-vt-open="false"
      data-vt
      onChange={(e) => {
        console.log(e.currentTarget);
        const currentTarget: VtFieldSet = e.currentTarget as VtFieldSet;
        console.log('value', currentTarget.value);
        console.log('array', currentTarget.valueAsArray);
        // console.log('flat', currentTarget.valueAsFlatGroups());
        // console.log('tree', currentTarget.valueAsTreeGroups());
      }}
    >
      <div data-vt-main></div>

      <div data-vt-area>
        <label htmlFor="r1">
          <input name="myRadioSelect" type="radio" id="r1" defaultValue="r1" />
          bike
        </label>
        <label htmlFor="r2">
          <input name="myRadioSelect" type="radio" id="r2" defaultValue="r2" />
          roller blades
        </label>
      </div>
      <div data-vt-backdrop></div>
    </fieldset>
  );
}
