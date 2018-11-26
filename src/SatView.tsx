import * as React from 'react';
import * as Sat from './sat';
import * as moment from 'moment';

import { SatMarker } from './SatMarker';
import { SatOrbit } from './SatOrbit';

interface SatViewProps {
    satDescription: Sat.SatDescription;
}

class RefreshingSatMarker extends React.Component<SatViewProps, {time: moment.Moment}> {
    private _interval: NodeJS.Timeout;

    constructor(props: SatViewProps) {
        super(props);

        this.state = {
            time: moment.utc()
        };
    }

    componentDidMount() {
        this._interval = setInterval(() => this.setState({time: moment.utc()}), 1000);
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    render() {
        const { satDescription } = this.props;

        const tle = new Sat.TLE(satDescription.state.TLE);    
        const satPosition = Sat.determinePosition(tle, this.state.time);
        
        const color = satDescription.colors;
    
        return (
            <>
                <SatMarker lat={satPosition.lat} lng={satPosition.lng} name={tle.satName} color={color.marker} />
            </>
        );
    }
}

export const SatView = (props: SatViewProps) : JSX.Element => {
    const { satDescription } = props;

    const tle = new Sat.TLE(satDescription.state.TLE);
    const track = Sat.calculateGroundTrack(tle, moment.utc());
    const color = satDescription.colors;

    return (
        <>
            <SatOrbit groundTrack={track} color={color.orbit} />
            <RefreshingSatMarker satDescription={satDescription} />
        </>
    );
};