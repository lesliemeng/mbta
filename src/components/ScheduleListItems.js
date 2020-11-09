/*
 * This component compiles schedule data for a stop within a route, when the user selects a stop to view schedule.
 */

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function ScheduleListItems(schedule, currentTime, limit = 3) {
    const url = `https://www.mbta.com/schedules/${schedule.route.id}/schedule?direction_id=${schedule.direct_id}&origin=${schedule.stop.id}`;
    const link = <a href={url} target="_blank">{url}</a>;
    const id = `${schedule.route.id}-${schedule.stop.id}-${schedule.direct_id}`;

    // Case 1: No data was found (maybe after hours)
    // Solution: show a link to the MBTA website for more details on the stop 
    // Example: https://www.mbta.com/schedules/Green-B/schedule?direction_id=0&origin=place-kencl
    if (schedule.departureTime.length === 0) {
        return [
            <ListItem key={id}>
                <ListItemText primary={'No Data'} secondary={link} />
            </ListItem>
        ];
    }

    // Case 2:
    // Solution: show departure times for both inbound and outbound directions
    // Example: can be found by going to 'Favorites' tab when no stops have been added to the Favorites list
    const list = [];
    for (let i = 0; i < limit && i < schedule.departureTime.length; i++) {
        const departureTime = new Date(schedule.departureTime[i]);

        // train has left
        if (departureTime - currentTime <= 0) {
            continue;
        }

        let t = Number.parseInt((departureTime - currentTime) / 1000, 10);
        let s = t % 60; t = Number.parseInt(t / 60, 10);
        let m = t % 60; t = Number.parseInt(t / 60, 10);
        let h = t % 24;

        const SS = s + 's';
        const MM = (m === 0) ? '' : (m + 'm ');
        const HH = (h === 0) ? '' : (h + 'h ');

        list.push(
            <ListItem key={`${id}-time-${i}`}
                style={{ textAlign: 'center' }}>
                <ListItemText
                    primary={departureTime.toLocaleTimeString()}
                    secondary={HH + MM + SS}
                />
            </ListItem>
        );
    }
    return list;
}

export default ScheduleListItems;
