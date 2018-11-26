import { Polyline as LeafletPolyline, LatLng, PathOptions, PolylineOptions } from 'leaflet';
import { Path, MapLayerProps } from 'react-leaflet';

require('./Leaflet.Geodesic/Leaflet.Geodesic');

// console.log({geodesic});

type LeafletElement = LeafletPolyline;

type PolylineProps = {
    positions: LatLng[];
} & MapLayerProps &
    PolylineOptions &
    PathOptions &
    object;

export default class Polyline extends Path<PolylineProps, LeafletElement> {
    private _geodesic: any;

    public createLeafletElement(props: PolylineProps): LeafletElement {
        const { positions, ...options } = props;
        this._geodesic = L.geodesic([positions], options);

        return this._geodesic;
    }

    public updateLeafletElement(fromProps: PolylineProps, toProps: PolylineProps) {
        if (toProps.positions !== fromProps.positions) {
            this._geodesic.setLatLngs([toProps.positions]);
        }
    }
}
