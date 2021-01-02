import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

declare var ol: any;

type NominatimResponse = {
  features: {
    geometry: {
      coordinates: [number, number];
    };
  }[];
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<NominatimResponse>(`https://nominatim.openstreetmap.org/search?format=geocodejson&q=${encodeURI(enteredAddress)}`)
    .then((response) => {
      if (!response.data.features[0]) {
        throw new Error('Incorrect input, please, try again');
      } else {
        const coordinates = response.data.features[0].geometry.coordinates;
        new ol.Map({
          target: 'map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat(coordinates),
            zoom: 14
          })
        });
      }
    })
    .catch((err) => {
      alert(err);
    });

  document.getElementById('map')!.innerHTML = '';
}

form.addEventListener('submit', searchAddressHandler);
