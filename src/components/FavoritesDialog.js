/*
 * This component displays a dialog when user tries to remove a stop from the favorites list,
 *  under the favorites tab.
 */

import React from 'react';
import { connect } from 'react-redux';

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

// FavoritesDialog
class FavoritesDialog extends React.Component {
    state = {}

    // close dialog
    closeDialog = () => {
        this.props.dispatch({
            type: 'UI_FAVORITES_DIALOG',
            open: false,
            message: ''
        });
    }

    // remove a schedule from favorites list
    removeSchedule = (schedule) => () => {
        this.props.dispatch({
            type: 'SCHEDULE_REMOVE',
            route_id: schedule.route.id,
            stop_id: schedule.stop.id,
            direct_id: schedule.direct_id
        });

        this.closeDialog();
    }

    render = () => {
        return (
            <Dialog
                open={this.props.dialog.open}
                onClose={this.closeDialog}
                keepMounted
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Do you want to remove this schedule?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.dialog.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.removeSchedule(this.props.dialog.schedule)} color="primary">
                        REMOVE
                    </Button>
                    <Button onClick={this.closeDialog} color="primary" autoFocus>
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect((state) => {
    return {
        dialog: state.ui.favorites_dialog
    }
})(FavoritesDialog);
