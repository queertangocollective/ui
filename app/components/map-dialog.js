import MapDialog from '@queertangocollective/ui/components/map-dialog/component';
import config from '../config/environment';

export default MapDialog.extend({
  apiKey: config.GOOGLE_MAPS_API_KEY
});
