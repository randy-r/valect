import { ValectDropdown } from './ValectDropdown';
import { ValectRadioDropdown } from './ValectRadioDropdown';
import { ValectReactWrapper } from './ValectReactWrapper';
import 'valect/src/valect-minimal.css';


function App() {
  return (
    <form
      action="#"
      id="form-2"
      onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        console.log(Object.fromEntries(formData));
      }}
    >
      <input form="form-2" name="bar" type="text" defaultValue="foo" />
      <input type="checkbox" />
      <select>
        <option defaultValue="x">x</option>
        <option defaultValue="y">y</option>
      </select>
      <input type="text" defaultValue="bar" />

      <ValectRadioDropdown />
      <ValectDropdown />
      <ValectReactWrapper />

      <button type="submit">submit</button>
      <button type="reset">reset</button>
    </form>
  );
}

export default App;
