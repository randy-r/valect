import { Valect } from 'valect';
import 'valect/src/valect-minimal.css';

const vt = document.querySelector('[data-vt]') as HTMLFieldSetElement;
if (!vt) throw 'bad';
const valect = new Valect(vt);
valect.wire();
