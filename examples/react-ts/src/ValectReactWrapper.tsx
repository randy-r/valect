import { useCallback, useEffect, useState } from 'react';
// import { VtFieldSet } from 'valect-groups/src/group-value';
import { Valect } from 'valect/src';
import { VtFieldSet } from 'valect/src/linear-value';
// import { Valect } from 'valect-groups/src';
import { ReactPrototype, OnChangeEventHandler } from './ReactPrototype';
import s from './styles.module.css';

const valect = new Valect();

export function ValectReactWrapper() {
  // const [shipChecked, setShipChecked] = useState(true);
  const [selectionTracker, setSelectionTracker] = useState(['ship']);
  const handleChange: OnChangeEventHandler = useCallback((e) => {
    const currentTarget: VtFieldSet = e.currentTarget as VtFieldSet;
    console.log('value', currentTarget.value);
    console.log('array', currentTarget.valueAsArray);
    setSelectionTracker((s) => currentTarget.valueAsArray);
    // console.log('flat', currentTarget.valueAsFlatGroups());
    // console.log('tree', currentTarget.valueAsTreeGroups());
    // setShipChecked((s) => !s);
  }, []);

  useEffect(() => {}, []);

  return (
    <ReactPrototype
      className={s.valectProto}
      valect={valect}
      onChange={handleChange}
      selectedArea={
        <span>
          {selectionTracker.map((x) => (
            <span className={s.selectionItem}>{x}</span>
          ))}
        </span>
      }
    >
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
            />
            I have a trycicle
          </label>
        </div>
      </div>

      <label htmlFor="ship">
        <input type="checkbox" id="ship" defaultValue="ship" defaultChecked />I
        have a ship
      </label>
    </ReactPrototype>
  );
}
