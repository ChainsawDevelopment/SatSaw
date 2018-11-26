import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map, ImageOverlay } from 'react-leaflet';
import * as Sat from './sat';
import * as Color from 'color';
import * as moment from 'moment';

import worldImage from './map.svg';
import Polyline from './libs/react-leaflet-geodesic/Polyline';

import 'leaflet/dist/leaflet.css';
import SatMarker from './SatMarker';

interface Props {
    satellites: Sat.Satellites;
}

const mapConfig = {
    center: new Leaflet.LatLng(0, 0),
    zoom: 1,
    minZoom: 1,
    maxZoom: 4
};

interface SatViewProps {
    satDescription: Sat.SatDescription;
}

interface OrbitProps {
    groundTrack: Leaflet.LatLng[];
    color: string;
}

const fadeIn = 10.0;
const fadeOut = 10.0;
const hueShift = 50.0;

const SatOrbit = (props: OrbitProps): JSX.Element => {
    
    const colorModification = (baseColor: Color, position: number): Color => {
        const hue = baseColor.hue();
        const shiftedColor = baseColor.hue(hue + (hueShift * position));
        const red = Math.round(shiftedColor.red());
        const green = Math.round(shiftedColor.green());
        const blue = Math.round(shiftedColor.blue());
        const alphaStart = position * fadeIn;
        const alphaEnd = (1.0 - position) * fadeOut;
        const alpha = Math.max(0, Math.min(alphaStart, 1.0, alphaEnd));

        return Color(`rgba(${red}, ${green}, ${blue}, ${alpha})`);
    };

    const polylines: JSX.Element[] = [];
    const baseColor = Color(props.color);
    for (let i = 1; i < props.groundTrack.length; i++) {
        const position = i / props.groundTrack.length;
        const color = colorModification(baseColor, position);
        polylines.push(
            <Polyline
                positions={[props.groundTrack[i - 1], props.groundTrack[i]]}
                color={color.string()}
                interactive={false}
                key={i}
            />
        );
    }

    return (
        <>
            {polylines}
        </>
    );
};

const SatView = (props: any) : JSX.Element => {
    const { satDescription } = props;

    // const satPosition = satDescription.state.CurrentPosition;
    const tle = new Sat.TLE(satDescription.state.TLE);

    // if (!satPosition) {
    //     return null;
    // }

    // const footprint = Sat.calculateFootprint(satPosition.alt) * 1000.0;
    const track = Sat.calculateGroundTrack(tle, moment.utc());
    const satPosition = Sat.determinePosition(tle, moment.utc());
    const color = satDescription.colors;

    return (
        <>
            <SatOrbit groundTrack={track} color={color.orbit} />
            {/* <SatCircle lat={satPosition.lat} lng={satPosition.lng} footprint={footprint} color={color.circle} /> */}
            <SatMarker lat={satPosition.lat} lng={satPosition.lng} name={tle.satName} color={color.marker} />}
        </>
    );
};


// tslint:disable-next-line:variable-name
export const SatellitesMap = (props : Props): JSX.Element => {
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
                center={mapConfig.center}
                zoom={mapConfig.zoom}
                style={{ flex: '1' }}
                minZoom={mapConfig.minZoom}
                maxZoom={mapConfig.maxZoom}
                crs={Leaflet.CRS.EPSG4326}
                maxBoundsViscosity={1.0}
                maxBounds={[[-90.0, -180.0], [90.0, 180.0]]}
                attributionControl={false}
            >
                <ImageOverlay url={worldImage} bounds={[[-90.0, -180.0], [90.0, 180.0]]} />
                <SatView
                    satDescription={{
                        state: props.satellites["PICSAT"],
                        colors: Sat.satColorFromIndex(0)
                    }}
                    key={`Sat-${0}`}
                /> 
            </Map>
        </div>
    );
};