import * as React from 'react';
import * as Leaflet from 'leaflet';
import * as ReactDOMServer from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';

// https://thenounproject.com/term/satellite/5350/
import satImage from '!!raw-loader!./sat.svg';

interface Props {
    name: string;
    lat: number;
    lng: number;
    color: string;
}

const createColoredImage = (color: string): string => {
    const parser = new DOMParser();
    const imageDocument = parser.parseFromString(satImage, 'image/svg+xml');

    imageDocument.documentElement.setAttribute('fill', color);

    const serializer = new XMLSerializer();

    return serializer.serializeToString(imageDocument);
};

export const SatMarker = (props: Props): JSX.Element => {
    const reactSpanIcon = (iconProps: { color: string }): JSX.Element => {
        const style = {
            width: '32px',
            height: '32px',
            display: 'block'
        };

        return (
            // tslint:disable-next-line:react-no-dangerous-html (This is the only way to change leaflet's icon)
            <span style={style} dangerouslySetInnerHTML={{ __html: createColoredImage(iconProps.color) }} />
        );
    };

    const icon = new Leaflet.DivIcon({
        iconAnchor: [16, 16],
        html: ReactDOMServer.renderToString(reactSpanIcon({ color: props.color })),
        className: ''
    });

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
