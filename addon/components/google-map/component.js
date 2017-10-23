import Component from '@ember/component';
import config from '../../config/environment';

export default Component.extend({
  tagName: '',
  zoom: 15,
  apiKey: config.GOOGLE_MAPS_API_KEY
});
