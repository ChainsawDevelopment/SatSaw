import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map, ImageOverlay } from 'react-leaflet';

import * as Sat from './sat';
import { SatView } from './SatView';

import worldImage from './map.svg';
import 'leaflet/dist/leaflet.css';

export interface MapConfig {
    center: Leaflet.LatLng;
    zoom: number;
    minZoom: number;
    maxZoom: number;
}

interface SatellitesMapProps {
    satellites: Sat.Satellites;
    config: MapConfig;
}

export const SatMap = (props : SatellitesMapProps): JSX.Element => {
    const { satellites } = props;
    const sats = Object.keys(satellites)
        .map(satName => satellites[satName])
        .map((satState, i: number) => (
            <SatView
                satDescription={{
                    state: satState,
                    colors: Sat.satColorFromIndex(i)
                }}
                key={`Sat-${i}`}
            />
        )
    );

    return (
        <div style={{ flex: '1', display: 'flex', height: '100%' }}>
            <Map
                center={props.config.center}
                zoom={props.config.zoom}
                style={{ flex: '1' }}
                minZoom={props.config.minZoom}
                maxZoom={props.config.maxZoom}
                crs={Leaflet.CRS.EPSG4326}
                maxBoundsViscosity={1.0}
                maxBounds={[[-90.0, -180.0], [90.0, 180.0]]}
                attributionControl={false}
            >
                <ImageOverlay url={worldImage} bounds={[[-90.0, -180.0], [90.0, 180.0]]} />
               {sats}
            </Map>
        </div>
    );
};