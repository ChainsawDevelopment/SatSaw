import * as React from 'react';
import * as moment from 'moment';
import * as Sat from './sat';

import { SatMarker } from './SatMarker';
import { SatOrbit } from './SatOrbit';

interface SatViewProps {
    satDescription: Sat.SatDescription;
}

class Refreshing extends React.Component<{interval: number, children(time: moment.Moment):void}, {time: moment.Moment}> {
    private _interval: NodeJS.Timeout;

    constructor(props) {
        super(props);

        this.state = {
            time: moment.utc()
        };
    }

    componentDidMount() {
        this._interval = setInterval(() => this.setState({time: moment.utc()}), this.props.interval);
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    render() {
        return (
            <>
                {this.props.children(this.state.time)}
            </>
        );
    }
}

export const SatView = (props: SatViewProps) : JSX.Element => {
    return (
        <>
            <Refreshing interval={60 * 1000}>
                {time => <SatOrbit satDescription={props.satDescription} time={time} />}
            </Refreshing>
            <Refreshing interval={1000}>
                {time => <SatMarker satDescription={props.satDescription} time={time} />}
            </Refreshing>
        </>
    );
};