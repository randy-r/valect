import { useEffect, useRef } from 'react';
import { VtFieldSet } from 'valect-groups/src/group-value';
import { ValectBase } from 'valect/src/valect-base';

type FieldsetProps = React.DetailedHTMLProps<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  HTMLFieldSetElement
>;

export type ValectOnChangeEvent = Event & {
  currentTarget: VtFieldSet;
};

export type OnChangeEventHandler = (event: Event) => any;

export type Props = Omit<FieldsetProps, 'value' | 'onChange'> & {
  className?: string;
  placeholder?: string;
  selectedArea?: React.ReactNode;
  children?: React.ReactNode;
  onChange?: OnChangeEventHandler;
  valect: ValectBase;
};

export function ReactPrototype(props: Props) {
  const {
    children,
    selectedArea,
    onChange,
    valect,
    placeholder = 'Select...',
    ...rest
  } = props;

  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    const fieldset = fieldsetRef.current;
    if (!fieldset) return;

    valect.wire(fieldset);

    onChange && fieldsetRef.current.addEventListener('change', onChange);

    return () => {
      valect.unwire();
      onChange && fieldsetRef.current?.removeEventListener('change', onChange);
    };
  }, [onChange, valect]);

  return (
    <fieldset
      data-vt
      data-vt-open="false"
      ref={fieldsetRef}
      aria-placeholder={placeholder}
      role="combobox checkbox"
      tabIndex={0}
      {...rest}
    >
      <div data-vt-main>
        {selectedArea ? selectedArea : <div data-vt-selected-area></div>}
      </div>
      <div data-vt-area>{children}</div>
      <div data-vt-backdrop></div>
    </fieldset>
  );
}
