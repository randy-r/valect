import { useEffect, useRef } from 'react';
import { Valect } from 'valect-groups/src/index';
import { VtFieldSet } from 'valect-groups/src/group-value';


export function ValectDropdown() {
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    const fieldset = fieldsetRef.current;
    if (!fieldset) return;

    const valect = new Valect();
    valect.wire(fieldset);

    const listener = (e: Event) => {
      console.log(e.currentTarget);
      const currentTarget: VtFieldSet = e.currentTarget as VtFieldSet;
      console.log('value', currentTarget.value);
      console.log('array', currentTarget.valueAsArray);
      console.log('flat', currentTarget.valueAsFlatGroups());
      console.log('tree', currentTarget.valueAsTreeGroups());
    };

    fieldsetRef.current.addEventListener('change', listener);

    return () => {
      valect.unwire();
      fieldsetRef.current?.removeEventListener('change', listener);
    };
  }, []);

  return <span>VelectDropdown placeholder</span>

  return (
    <fieldset
      ref={fieldsetRef}
      aria-placeholder="Select..."
      name="myCheckboxSelect"
      role="combobox checkbox"
      tabIndex={0}
      data-vt-open="false"
      data-vt
      id="fieldset-2"
      onChange={(e) => {
        console.log(e.currentTarget);
        const currentTarget: VtFieldSet = e.currentTarget as VtFieldSet;
        console.log('value', currentTarget.value);
        console.log('array', currentTarget.valueAsArray);
        console.log('flat', currentTarget.valueAsFlatGroups());
        console.log('tree', currentTarget.valueAsTreeGroups());
      }}
    >
      <div data-vt-main></div>

      <div data-vt-area>
        <label htmlFor="g1">
          <input
            type="checkbox"
            id="g1"
            defaultValue="g1"
            data-vt-groupvalue="g1"
          />
          group 1
        </label>
        <div data-vt-groupcontent>
          <label htmlFor="bike">
            <input
              data-vt-group="g1"
              type="checkbox"
              id="bike"
              defaultValue="bike"
            />
            I have a bike
          </label>
          <label htmlFor="car">
            <input
              data-vt-group="g1"
              type="checkbox"
              id="car"
              defaultValue="car"
            />
            I have a car
          </label>
          <label htmlFor="g1.1" data-vt-label="ABC">
            <input
              type="checkbox"
              id="g1.1"
              defaultValue="g1.1"
              data-vt-group="g1"
              data-vt-groupvalue="g1.1"
            />
            group 1.1
          </label>
          <div data-vt-groupcontent>
            <label htmlFor="tricycle">
              <input
                data-vt-group="g1.1"
                type="checkbox"
                id="tricycle"
                defaultValue="tricycle"
                defaultChecked
              />
              I have a trycicle
            </label>
          </div>
        </div>

        <label htmlFor="ship">
          <input type="checkbox" id="ship" defaultValue="ship" defaultChecked />
          I have a ship
        </label>
      </div>
      <div data-vt-backdrop></div>
    </fieldset>
  );
}
