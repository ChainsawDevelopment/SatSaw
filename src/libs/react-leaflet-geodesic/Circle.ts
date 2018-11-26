import { Polyline as LeafletPolyline, LatLng, PathOptions, PolylineOptions } from 'leaflet';
import { Path, MapLayerProps } from 'react-leaflet';

import './polyfill';

type LeafletElement = LeafletPolyline;

type CircleProps = {
    center: LatLng;
    radius: number;
    steps?: number;
} & MapLayerProps &
    PolylineOptions &
    PathOptions &
    object;

export default class Circle extends Path<CircleProps, LeafletElement> {
    private _geodesic: any;

    public createLeafletElement(props: CircleProps): LeafletElement {
        const { center, radius, ...options } = props;
        this._geodesic = L.geodesic([], options);
        this._geodesic.createCircle(center, radius);

        return this._geodesic;
    }

    public updateLeafletElement(fromProps: CircleProps, toProps: CircleProps) {
        if (toProps.center !== fromProps.center) {
            this._geodesic.createCircle(toProps.center, toProps.radius);
        }
        if (toProps.radius !== fromProps.radius) {
            this._geodesic.createCircle(toProps.center, toProps.radius);
        }
    }
}
