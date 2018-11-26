import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Leaflet from 'leaflet';
import { SatMap, MapConfig } from './SatMap';
import * as Sat from './sat'

const satellites : Sat.Satellites = {
    PWSAT2: {
        TLE: [
            '0 PW-SAT 2',
            '1 99999U 18999XXX 18323.80207747  .00000002  00000-0  00000-0 0    42',
            '2 99999  97.7745  32.5818 0011760  98.7943 182.3934 15.00210209    20'
            
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