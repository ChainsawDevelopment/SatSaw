import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map, ImageOverlay, Marker } from 'react-leaflet';

import * as Sat from './sat';
import { SatView } from './SatView';

import worldImage from './map.svg';
import 'leaflet/dist/leaflet.css';


import fddLogo from './fdd-77-24.png'

export interface MapConfig {
    center: Leaflet.LatLng;
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

    const icon = new Leaflet.Icon({
        iconUrl: fddLogo,
        iconSize: [77, 24],
        iconAnchor: [7, 12]
    });
    
    return (
        <div style={{ flex: '1', display: 'flex', height: '100%' }}>
            <Map
                zoomSnap={0.25}
                center={props.config.center}
                style={{ flex: '1' }}
                minZoom={props.config.minZoom}
                maxZoom={props.config.maxZoom}
                crs={Leaflet.CRS.EPSG4326}
                maxBoundsViscosity={1.0}
                maxBounds={[[-90.0, -180.0], [90.0, 180.0]]}
                bounds={[[-90.0, -180.0], [90.0, 180.0]]}
                attributionControl={false}
            >
                <ImageOverlay url={worldImage} bounds={[[-90.0, -180.0], [90.0, 180.0]]} />
{/*                 
                <Marker 
                    icon={icon}
                    position={[50.2937332,18.6797681]} /> */}
               {sats}
            </Map>
        </div>
    );
};