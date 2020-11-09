/*
 * Root component of the app.
 */

import React from 'react';
import { connect } from 'react-redux';

// AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Components
import Search from './Search';
import Favorites from './Favorites';
import PreferenceDialog from './PreferenceDialog';
import FavoritesDialog from './FavoritesDialog';
import SearchDialog from './SearchDialog';
import MessageSnackbar from './MessageSnackbar';

// BottomNavigation
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

// Icon
import HomeIcon from '@material-ui/icons/Home';
import StarIcon from '@material-ui/icons/Star';
import SettingsIcon from '@material-ui/icons/Settings';
import RefreshIcon from '@material-ui/icons/Refresh';

// MBTA
import prediction from '../mbta/prediction';

// App
class App extends React.Component {
    state = {}

    constructor(props) {
        super(props);

        this.updateSchedule();
        setInterval(() => {
            // update data every 10 sec
            this.updateSchedule();
        }, 10000);
    }

    updateSchedule = (event) => {
        const schedules = { ...this.props.schedules };

        const requests = [];
        for (const key in schedules) {
            const sch = schedules[key];
            requests.push(prediction(sch.route.id, sch.stop.id, sch.direct_id));
        }

        // loading
        this.props.dispatch({
            type: 'UI_SCHEDULE_REFRESH',
            refreshing: true
        });

        Promise.all(requests)
            .then(departureTimes => {
                let i = 0;
                for (const key in schedules) {
                    const sch = schedules[key];
                    sch.departureTime = departureTimes[i++];
                }

                this.props.dispatch({
                    type: 'SCHEDULE_UPDATE',
                    schedules: schedules
                });

                // unloading
                this.props.dispatch({
                    type: 'UI_SCHEDULE_REFRESH',
                    refreshing: false
                });
            })
            .catch(error => {
                // show error message if RefreshIcon was clicked
                if (event) {
                    this.props.dispatch({
                        type: 'UI_SEARCH_DIALOG_SNACK_BAR',
                        open: true,
                        message: 'Failed to retrieve data from server. Please check your Internet.',
                        variant: 'error'
                    });
                }
            });
    }

    panelChange = (event, panelNumber) => {
        this.props.dispatch({
            type: 'UI_PANEL_CHANGE',
            panel: panelNumber
        });
    }

    openPreference = () => {
        this.props.dispatch({
            type: 'UI_PREFRENCE_DIALOG',
            open: true
        });
    }

    showPanel = (panelNumber) => {
        if (panelNumber !== this.props.panel) {
            return { display: 'none' };
        }
    }

    render = () => {
        // TODO: not in use. set toolbar title, if not in search, then display current time
        // const toolBarTitle = this.props.panel === 0 ? 'Search' : this.props.currentTime.toLocaleTimeString();

        return (
            <div>
                <PreferenceDialog />
                <FavoritesDialog />
                <SearchDialog />
                <MessageSnackbar />

                <AppBar position="sticky" style={{ backgroundColor: '#1f88ff', color: 'white' }}>
                    <Toolbar>
                        {/* Preference Settings Icon */}
                        <IconButton color="inherit" onClick={this.openPreference}>
                            <SettingsIcon />
                        </IconButton>

                        {/* Title */}
                        <Typography type="title" color="inherit" style={{ margin: 'auto', position: 'relative', fontSize: '24px' }}>
                            MBTA Schedule
                        </Typography>

                        {/* Refresh Icon */}
                        <IconButton color="inherit" onClick={this.updateSchedule}>
                            {<RefreshIcon />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <div style={{ marginTop: '-6px', marginBottom: '45px' }}>
                    {/* Panel 0 */}
                    <Search style={this.showPanel(0)} />
                    {/* Panel 1 */}
                    <Favorites style={this.showPanel(1)} />
                </div>

                <BottomNavigation
                    showLabels
                    value={this.props.panel}
                    onChange={this.panelChange}
                    style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'WhiteSmoke' }}
                >
                    <BottomNavigationAction label={'Search'} icon={<HomeIcon />} />
                    <BottomNavigationAction label={'Favorites'} icon={<StarIcon />} />
                </BottomNavigation>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        currentTime: state.currentTime,
        schedules: state.schedules,
        panel: state.ui.panel,
        refreshing: state.ui.schedule_is_refreshing
    }
})(App);
