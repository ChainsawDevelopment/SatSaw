import * as satellite from 'satellite.js';
import * as moment from 'moment';

import * as Leaflet from 'leaflet';



export class LookAngles {
    public azimuth: number;
    public elevation: number;
    public rangeSat: number;
}

export class PassPrediction {
    public readonly start: moment.Moment;
    public readonly end: moment.Moment;
    public readonly duration: moment.Duration;

    public readonly minAzimuth: number;
    public readonly apexAzimuth: number;
    public readonly maxAzimuth: number;
    public readonly maxElevation: number;

    public readonly aosAzimuth: number;
    public readonly losAzimuth: number;

    constructor(jsPredictTransit: any) {
        this.start = moment.utc(jsPredictTransit.start);
        this.end = moment.utc(jsPredictTransit.end);
        this.duration = moment.duration(jsPredictTransit.duration);

        this.minAzimuth = jsPredictTransit.minAzimuth;
        this.apexAzimuth = jsPredictTransit.apexAzimuth;
        this.maxAzimuth = jsPredictTransit.maxAzimuth;
        this.maxElevation = jsPredictTransit.maxElevation;

        this.aosAzimuth =  jsPredictTransit.aosAzimuth;
        this.losAzimuth =  jsPredictTransit.losAzimuth;
    }
}

export class PassPredictionParameters {
    public static DefaultPredictions(): PassPredictionParameters {
        return new PassPredictionParameters(moment.duration(3, 'd'), 5.0, 20);
    }

    public static NearestPass(): PassPredictionParameters {
        return new PassPredictionParameters(moment.duration(1, 'd'), 5.0, 1);
    }

    constructor(
        public readonly timeFrame: moment.Duration,
        public readonly minimumElevation: number,
        public readonly maximumPasses: number
    ) {
    }
}

export class TLE {
    public constructor(
        private readonly _value: string[]
    ) {
    }

    public get satName() {
        return this._value[0].substr(2);
    }

    public toText(): string[] {
        return this._value;
    }

    public getLine(lineNumber: number): string {
        return this._value[lineNumber];
    }

    public toString(): string {
        return this._value.join('\n');
    }
}



class SatelliteStateVector {
    public positionAndVelocity: any;
    public greenwichMeanSiderealTime: number;
}


export interface SatelliteState {
    readonly TLE: string[];
    readonly CurrentPosition: Leaflet.LatLng;
    readonly LookAngles: LookAngles;
}

export interface SatDescription {
    colors: SatColor;
    state: SatelliteState;
}

export interface Satellites {
    [satName: string]: SatelliteState;
}

export const calculateSatelliteStateVector = (tle: TLE, time: moment.Moment): SatelliteStateVector => {
    const satrec = satellite.twoline2satrec(tle.getLine(1), tle.getLine(2));
    const positionAndVelocity: any = satellite.propagate(satrec, time.toDate());

    const gmst = satellite.gstime(time.toDate());

    return {
        positionAndVelocity,
        greenwichMeanSiderealTime: gmst
    };
};

export const calculateFootprint = (heightMeters: number): number => {
    const earthRadiusMeters = 6.378137E6; // earth radius (m) wgs84

    return earthRadiusMeters * Math.acos(earthRadiusMeters / (earthRadiusMeters + heightMeters)) / 1000.0;
};

export const convertQthToPositionInRadians = (qth: number[]): satellite.Geodetic => {
    return {
        latitude: qth[0] / 180.0 * Math.PI,
        longitude: qth[1] / 180.0 * Math.PI,
        height: qth[2]
    };
};

export const convertGeodeticToLatLng = (geodetic: satellite.Geodetic): Leaflet.LatLng => {
    return new Leaflet.LatLng(
        geodetic.latitude * 180.0 / Math.PI,
        geodetic.longitude * 180.0 / Math.PI,
        geodetic.height * 1000
    );
};

export const convertLookAnglesRadianToDegree = (newLookAnglesRadian: satellite.LookAngles): satellite.LookAngles => {
    return {
        azimuth: newLookAnglesRadian.azimuth / Math.PI * 180.0,
        elevation: newLookAnglesRadian.elevation / Math.PI * 180.0,
        rangeSat: newLookAnglesRadian.rangeSat
    };
};

export const determinePosition = (tle: TLE, time: moment.Moment): Leaflet.LatLng => {
    const satelliteStateVector = calculateSatelliteStateVector(tle, time);
    const geodetic = satellite.eciToGeodetic(satelliteStateVector.positionAndVelocity.position,
        satelliteStateVector.greenwichMeanSiderealTime);

    return convertGeodeticToLatLng(geodetic);
};

export const determineLookAngles = (tle: TLE, qth: number[], time: moment.Moment): satellite.LookAngles => {
    const satelliteStateVector = calculateSatelliteStateVector(tle, time);
    const positionEcf = satellite.eciToEcf(satelliteStateVector.positionAndVelocity.position,
        satelliteStateVector.greenwichMeanSiderealTime);
    const observerGeodetic = convertQthToPositionInRadians(qth);

    return satellite.ecfToLookAngles(observerGeodetic, positionEcf);
};

export const calculateGroundTrack = (tle: TLE, time: moment.Moment): Leaflet.LatLng[] => {
    const satelliteTime = time.clone().subtract(30, 'minutes');
    const end = time.clone().add(4, 'hours');

    const groundTrack: Leaflet.LatLng[] = [];
    while (satelliteTime < end) {
        const position = determinePosition(tle, satelliteTime);
        groundTrack.push(position);
        satelliteTime.add(5, 'minutes');
    }

    return groundTrack;
};

export const calculateSatelliteLookAngles = (tle: TLE, qth: number[], time: moment.Moment): LookAngles => {
    const newLookAnglesRadian = determineLookAngles(tle, qth, time);
    const newLookAngles = convertLookAnglesRadianToDegree(newLookAnglesRadian);

    return newLookAngles.elevation >= 0 ? newLookAngles : null;
};


const colors = [
    0,
    180,
    60,
    240,
    300,
    120
];

export interface SatColor {
    marker: string;
    orbit: string;
    circle: string;
}

export const satColorFromHue = (hue: number): SatColor => {
    return {
        marker: `hsl(${hue}, 80%, 35%)`,
        orbit: `hsl(${hue}, 30%, 60%)`,
        circle: `hsl(${hue}, 30%, 60%)`
    };
};

export const satColorFromIndex = (index: number): SatColor => satColorFromHue(colors[index % colors.length]);