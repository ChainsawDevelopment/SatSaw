import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

import pwsat2Icon from './PW-Sat2-logo.png';

interface Props {
    name: string;
    lat: number;
    lng: number;
    color: string;
}

export const SatMarker = (props: Props): JSX.Element => {
    const icon = new Leaflet.Icon({
        iconUrl:pwsat2Icon,
        iconSize: [167, 96],
        iconAnchor: [46, 47]
    })

    return (
        <Marker
            position={new Leaflet.LatLng(props.lat, props.lng)}
            key={`marker_${props.name}`}
            icon={icon}
        >
            <Popup>
                <span>{props.name}</span>
            </Popup>
        </Marker>
    );
};
