import * as React from 'react';
import * as Leaflet from 'leaflet';
import * as Color from 'color';
import * as moment from 'moment';
import * as Sat from './sat';

import Polyline from './libs/react-leaflet-geodesic/Polyline';

interface OrbitViewProps {
    groundTrack: Leaflet.LatLng[];
    color: string;
}

const fadeIn = 10.0;
const fadeOut = 10.0;
const hueShift = 50.0;

export const SatOrbitView = (props: OrbitViewProps): JSX.Element => {
    
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

interface OrbitProps {
    satDescription: Sat.SatDescription;
    time: moment.Moment;
}

export const SatOrbit = (props: OrbitProps): JSX.Element => {

    const tle = new Sat.TLE(props.satDescription.state.TLE);
    const track = Sat.calculateGroundTrack(tle, props.time);
    const color = props.satDescription.colors;

    return <SatOrbitView groundTrack={track} color={color.orbit} />
}