// frontend/src/services/geocodeService.js
import axios from 'axios';

export async function geocodeLocation(lat, lng) {
  try {
    const { data } = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      { params: { lat, lon: lng, format: 'json' } }
    );
    return data.display_name || 'Unknown location';
  } catch {
    return 'Location name unavailable';
  }
}
