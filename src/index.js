import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

// Redux
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

// Reducer
import uiReducer from "./reducers/ui-reducer";
import timeReducer from "./reducers/time-reducer";
import scheduleReducer from "./reducers/schedule-reducer";
import searchScheduleReducer from "./reducers/search-schedule-reducer";
import preferenceReducer from "./reducers/preference-reducer";

const reducer = combineReducers({
    ui: uiReducer,
    currentTime: timeReducer,
    schedules: scheduleReducer,
    searchSchedule: searchScheduleReducer,
    preference: preferenceReducer,
});

// Store
const store = createStore(reducer);

// Update Time every 0.5 sec
setInterval(() => {
    store.dispatch({ type: "TIME_UPDATE" });
}, 500);

// React Render
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);

registerServiceWorker();
