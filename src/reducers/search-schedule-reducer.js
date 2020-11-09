/*
 * This holds default schedule state for search related functions, and reducers for Search.
 */

// default schedule
const defaultSchedule = {
    route: {
        direction: []
    },
    stop: {},
    destination: {},
    departureTime: []
}

// default state
const defaultState = {
    inbound: defaultSchedule,
    outbound: defaultSchedule
}

// reducer
const searchScheduleReducer = (state = defaultState, action) => {

    if (action.type === 'SEARCH_SCHEDULE') {
        const { route, stop, departureTimes } = action;

        return {
            inbound: {
                route: route,
                stop: stop,
                direct_id: 0,
                destination: route.stops[route.stops.length - 1],
                isFailed: false,
                departureTime: departureTimes[0]
            },
            outbound: {
                route: route,
                stop: stop,
                direct_id: 1,
                destination: route.stops[0],
                isFailed: false,
                departureTime: departureTimes[1]
            }
        };
    }

    return state;
}

export default searchScheduleReducer;
