import { helper } from '@ember/component/helper';
import { svgJar } from './svg-jar';

export function icon(name, hash) {
  let attributes = Object.assign({ class: 'icon' }, hash);
  if (attributes.class.indexOf('icon') === -1) {
    attributes.class += ' icon';
  }

  return svgJar(name, attributes);
}

export default helper(function ([name], hash) {
  return icon(name, hash);
});
