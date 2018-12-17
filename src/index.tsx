import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Leaflet from 'leaflet';
import { SatMap, MapConfig } from './SatMap';
import * as Sat from './sat'

const satellites : Sat.Satellites = {
    PWSAT2: {
        TLE: [
            '0 PW-SAT 2',
            '1 43758U 18099A   18337.80370529 0.00000000  00000-0  00000-0 0  9990',
            '2 43758  97.6913  47.2054 0012666 260.5031  20.7110 14.94923662    01'
        ],
        CurrentPosition: null,
        LookAngles: null
    },
}

const mapConfig: MapConfig = {
    center: new Leaflet.LatLng(0, 0),
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