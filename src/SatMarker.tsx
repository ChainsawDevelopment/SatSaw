import * as React from 'react';
import * as Leaflet from 'leaflet';
import * as moment from 'moment';
import { Marker, Popup } from 'react-leaflet';
import * as Sat from './sat';

import pwsat2Icon from './PW-Sat2-logo.png';

interface MarkerViewProps {
    name: string;
    lat: number;
    lng: number;
    color: string;
}

const SatMarkerView = (props: MarkerViewProps): JSX.Element => {
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

export interface SatMarkerProps {
    satDescription: Sat.SatDescription; 
    time: moment.Moment
}

export const SatMarker = (props: SatMarkerProps): JSX.Element => {
    const { satDescription } = props;

    const tle = new Sat.TLE(satDescription.state.TLE);
    const satPosition = Sat.determinePosition(tle, props.time);
    const color = satDescription.colors;

    return <>
        <SatMarkerView lat={satPosition.lat} lng={satPosition.lng} name={tle.satName} color={color.marker} />
    </>
};
