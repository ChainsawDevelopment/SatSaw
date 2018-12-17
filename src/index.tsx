import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Leaflet from 'leaflet';
import { SatMap, MapConfig } from './SatMap';
import * as Sat from './sat'

import { BrowserRouter as Router, Route, Link, RouteComponentProps } from "react-router-dom";

const builtInSatellites : Sat.Satellites = {
    pwsat: {
        TLE: [
            '0 PW-SAT 2',
            '1 43758U 18099A   18337.80370529 0.00000000  00000-0  00000-0 0  9990',
            '2 43758  97.6913  47.2054 0012666 260.5031  20.7110 14.94923662    01'
        ],
        CurrentPosition: null,
        LookAngles: null
    },
}

const mapConfig: MapConfig = {
    center: new Leaflet.LatLng(0, 0),
    minZoom: 1,
    maxZoom: 4
    
};

namespace SatFromUrlProvider {
    export type Props = RouteComponentProps<{sat?: string}>;
    export interface State {
        visibleSats: Sat.Satellites
    }
}

class SatFromUrlProvider extends React.Component<SatFromUrlProvider.Props, SatFromUrlProvider.State> 
{
    constructor(props: SatFromUrlProvider.Props) {
        super(props);

        this.state = { visibleSats: {} }
    }

    private makeVisibleSat(tle: string) : Sat.Satellites {
        const visibleSat = {};
        visibleSat["sat1"] = {
            TLE:tle.match(/[^\r\n]+/g),
            CurrentPosition: null,
            LookAngles: null
        }

        return visibleSat;
    }

    componentDidMount(): void {
        const satParam = this.props.match.params.sat || "pwsat";
        const requestedSats = satParam.split(',');

        // assume single sat for now
        const sat = requestedSats[0];

        // first, check if it's built int sat
        if (builtInSatellites[sat] !== undefined) {
            const visibleSats = {};
            visibleSats[sat] = builtInSatellites[sat];
            
            this.setState({visibleSats});
        }

        // if number, then treat it as norad id
        if (isNaN(+sat) === false) {
            console.error("Norad ID not supported yet")
        }

        // treat it as entire TLE - base64 encoded
        const decodedTle = atob(sat)
        this.setState({visibleSats: this.makeVisibleSat(decodedTle)});
        
    }

    render(): React.ReactNode {
        return <SatMap satellites={this.state.visibleSats} config={mapConfig} />
    }
}

const render = () => {
    ReactDOM.render(
        <Router>
            <div>
                <Route path="/:sat*" component={SatFromUrlProvider} />
            </div>
        </Router>,
        document.getElementById("content")
    );
}

render();