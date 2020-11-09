/*
 * This component compiles everything needed to display data in the Search tab:
 *  List of Routes and the list of stops nested within.
 */

import React from 'react';
import { connect } from 'react-redux';

// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';

// Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

// Progress
import CircularProgress from '@material-ui/core/CircularProgress';

// MBTA
import prediction from '../mbta/prediction';
import logo from '../images/logo.png';
import Routes from '../mbta/route.json';

// Search
class Search extends React.Component {
    state = {}

    collapseHandler = (routeId) => () => {
        this.props.dispatch({
            type: 'UI_SEARCH_COLLAPSE',
            routeId: routeId
        });
    }

    popupSchedule = (route, stop) => () => {

        const isLoading = this.props.loading.hasOwnProperty(`${route.id}_${stop.id}`);
        if (isLoading) {
            // block the ListItem, not to call the API at the sametime
            return;
        }

        // loading
        const key = `${route.id}_${stop.id}`;
        this.props.dispatch({
            type: 'UI_SCHEDULE_LOADING_ADD',
            schedule: key
        });

        Promise.all([
            prediction(route.id, stop.id, 0),
            prediction(route.id, stop.id, 1)
        ])
            .then(departureTimes => {
                this.props.dispatch({
                    type: 'SEARCH_SCHEDULE',
                    route: route,
                    stop: stop,
                    departureTimes: departureTimes
                });

                this.props.dispatch({
                    type: 'UI_SEARCH_DIALOG',
                    open: true
                });

                // unloading
                this.props.dispatch({
                    type: 'UI_SCHEDULE_LOADING_REMOVE',
                    schedule: key
                });
            })
            .catch(error => {
                // show error message
                this.props.dispatch({
                    type: 'UI_SEARCH_DIALOG_SNARCK_BAR',
                    open: true,
                    message: 'Failed to retrieve data from server. Please check your Internet.',
                    variant: 'error'
                });

                // unloading after 2 second
                setTimeout(() => {
                    this.props.dispatch({
                        type: 'UI_SCHEDULE_LOADING_REMOVE',
                        schedule: key
                    });
                }, 2000);
            });
    }

    showArrowIcon = (route_id, stop_id, direct_id) => {
        return this.props.schedules.hasOwnProperty(`${route_id}_${stop_id}_${direct_id}`) ?
            {} : { visibility: 'hidden' };
    }

    render = () => {

        // List of Routes
        const list = [];
        for (let route of Routes) {

            list.push(
                <ListItem button key={route.id + '-route'}
                    style={{ backgroundColor: route.color, opacity: 0.9 }}
                    onClick={this.collapseHandler(route.id)}>

                    <ListItemIcon style={{ paddingLeft: '18px', marginRight: '-50px' }}>
                        <img alt='' src={logo} style={{ height: '30px', width: '30px' }} />
                    </ListItemIcon>

                    <ListItemText inset
                        primary={route.name}
                        primaryTypographyProps={{
                            style: {
                                color: route.text_color,
                                fontSize: '20px'
                            }
                        }}
                        secondary={`${route.direction[0]}bound / ${route.direction[1]}bound`}
                        secondaryTypographyProps={{
                            style: {
                                color: route.text_color,
                                fontSize: '18px'
                            }
                        }} />
                    {this.props.collapse[route.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
            );

            // List of stops
            let stops = [];
            for (let stop of route.stops) {

                const isLoading = this.props.loading.hasOwnProperty(`${route.id}_${stop.id}`);
                stops.push(
                    <ListItem button={!isLoading} key={stop.id} onClick={this.popupSchedule(route, stop)}>

                        {isLoading && <CircularProgress size={20} style={{ marginRight: '20px' }} />}

                        <ListItemText inset primary={stop.name} style={{ paddingLeft: '80px' }}/>

                        <ArrowDownwardIcon style={this.showArrowIcon(route.id, stop.id, 0)} />
                        <ArrowUpwardIcon style={this.showArrowIcon(route.id, stop.id, 1)} />
                    </ListItem>
                );
            }

            // Collapse with stop list
            list.push(
                <Collapse key={route.id + '-collapse'} in={this.props.collapse[route.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {stops}
                    </List>
                </Collapse>
            );

            // Add Divider
            list.push(
                <Divider key={route.id + '-divider'} light />
            )
        }

        return ( <List component="nav" style={this.props.style}>{list}</List> );
    }
}

export default connect((state) => {
    return {
        collapse: state.ui.search_collapse,
        schedules: state.schedules,
        loading: state.ui.schedule_loading
    }
})(Search);
