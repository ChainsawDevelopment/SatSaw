import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Leaflet from 'leaflet';
import { SatMap, MapConfig } from './SatMap';
import * as Sat from './sat'

const satellites : Sat.Satellites = {
    PICSAT: {
        TLE: [
            '0 PICSAT',
            '1 43132U 18004X   18084.90518637 +.00001736 +00000-0 +78164-4 0  9993',
            '2 43132 097.5436 147.3314 0010912 038.1742 322.0265 15.22402283011045'
        ],
        CurrentPosition: null,
        LookAngles: null
    },
}

const mapConfig: MapConfig = {
    center: new Leaflet.LatLng(0, 0),
    zoom: 1,
    minZoom: 1,
    maxZoom: 4
};

const render = () => {
    ReactDOM.render(
        <SatMap satellites={satellites} config={mapConfig} />,
        document.getElementById("content")
    );
}

render();