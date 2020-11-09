/*
 * This holds default state for the schedule to be searched, and the reducer for searching a schedule.
 */

// default state
const defaultState = JSON.parse(localStorage.getItem('schedules') || '{}');

// reducer
const scheduleReducer = (state = defaultState, action) => {
    let newState = state;

    // Add
    if (action.type === 'SCHEDULE_ADD') {
        const { route, stop, direct_id } = action;
        const key = [route.id, stop.id, direct_id].join('_');

        newState = {
            ...state,
            [key]: {
                route: {
                    id: route.id,
                    name: route.name,
                    short_name: route.short_name,
                    color: route.color,
                    text_color: route.text_color,
                    direction: route.direction
                },
                stop: stop,
                direct_id: direct_id,
                destination: route.stops[direct_id === 1 ? 0 : route.stops.length - 1],
                isFailed: false,
                departureTime: action.departureTime
            }
        }
    }

    // Remove
    if (action.type === 'SCHEDULE_REMOVE') {
        const key = [action.route_id, action.stop_id, action.direct_id].join('_');

        newState = {...state};
        delete newState[key];
    }

    // Update
    if (action.type === 'SCHEDULE_UPDATE') {
        newState = action.schedules;
    }

    // Save to local storage
    localStorage.setItem('schedules', JSON.stringify(newState));
    
    // return new state
    return newState;
}

export default scheduleReducer;
