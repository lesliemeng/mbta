/*
 * This holds default state for the app, and UI reducers for each UI component.
 */

// default state of app
const defaultState = {
    // { "Blue": false, "Orange": false, "Red": false, ...}
    search_collapse: JSON.parse(localStorage.getItem('search_collapse') || '{}'),
    panel: Number.parseInt(localStorage.getItem('panel') || '0', 10),
    search_dialog: false,
    schedule_loading: {},
    preference_dialog: false,
    schedule_is_refreshing: false,
    snackbar: {
        open: false,
        message: '',
        variant: ''
    },
    favorites_dialog: {
        open: false,
        message: '',
        schedule: {}
    }
};

// reducer
const uiReducer = (state = defaultState, action) => {
    let newState = state;

    // bottom panel change (between search & favorites)
    if (action.type === 'UI_PANEL_CHANGE') {
        newState = {
            ...state,
            panel: action.panel
        };
    }

    // until a stop is selected, should be collapsed
    if (action.type === 'UI_SEARCH_COLLAPSE') {
        const collapse = { ...state.search_collapse };
        collapse[action.routeId] = !collapse[action.routeId];

        newState = {
            ...state,
            search_collapse: collapse
        }
    }

    // search dialog
    if (action.type === 'UI_SEARCH_DIALOG') {
        newState = {
            ...state,
            search_dialog: action.open
        }
    }

    // show loading indicator when schedule is loading
    if (action.type === 'UI_SCHEDULE_LOADING_ADD') {
        const loading = {
            ...state.schedule_loading,
        };
        loading[action.schedule] = true;

        newState = {
            ...state,
            schedule_loading: loading
        }
    }

    // removed schedule loading indicator
    if (action.type === 'UI_SCHEDULE_LOADING_REMOVE') {
        const loading = {
            ...state.schedule_loading
        };
        delete loading[action.schedule];

        newState = {
            ...state,
            schedule_loading: loading
        }
    }

    // preference dialog for how many schedule to show max
    if (action.type === 'UI_PREFRENCE_DIALOG') {
        newState = {
            ...state,
            preference_dialog: action.open
        }
    }

    // refresh schedules manually
    // refresh is done automatically every 10 seconds
    if (action.type === 'UI_SCHEDULE_REFRESH') {
        newState = {
            ...state,
            schedule_is_refreshing: action.refreshing
        }
    }

    // snack bar from bottom with notification messages
    if (action.type === 'UI_SEARCH_DIALOG_SNACK_BAR') {
        newState = {
            ...state,
            snackbar: {
                open: action.open,
                message: action.message,
                variant: action.variant
            }
        }
    }

    // favorites dialog
    if (action.type === 'UI_FAVORITES_DIALOG') {
        newState = {
            ...state,
            favorites_dialog: {
                open: action.open,
                message: action.message,
                schedule: action.schedule
            }
        }
    }

    // save to location storage
    localStorage.setItem('panel', newState.panel);
    localStorage.setItem('search_collapse', JSON.stringify(newState.search_collapse));

    return newState;
}

export default uiReducer;
