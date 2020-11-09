/*
 * A helper script to generate `./route.json`
 */
const fs = require('fs');
const co = require('co');
const fetch = require('node-fetch');
const host = 'https://api-v3.mbta.com';

// fetch and only keep these routes: Red, Orange, Green B, Green C, Green D, Green E, Blue
// format and only keep info we need
co(function * () {
    
    // https://api-v3.mbta.com/routes
    let res = yield fetch(host + '/routes').then(res => res.json());
    const routes = res.data.slice(0, 8); // all light & heavy rails
    // remove mattapan trolly (not light or heavy rail)
    routes.splice(1, 1);

    // configure every route
    for (let route of routes) {

        // keep
        route.name = route.attributes.long_name;
        route.short_name = route.attributes.short_name;
        route.color = '#' + route.attributes.color;
        route.text_color = '#' + route.attributes.text_color;
        route.direction = route.attributes.direction_names + 'bound';

        // delete
        delete route.links;
        delete route.type;
        delete route.attributes;

        // https://api-v3.mbta.com/stops?filter[route]=Orange
        let stops = yield fetch(host + '/stops?filter[route]=' + route.id)
                            .then(res => res.json())
                            .then(res => res.data.reverse());
                            // reverse so order of the stops goes from North to South
                            // and East to West

        for (let stop of stops) {

            // keep
            stop.name = stop.attributes.name;

            // delete
            delete stop.links;
            delete stop.relationships;
            delete stop.type;
            delete stop.attributes;
        }

        // populate
        route.stops = stops;
    }

    // write file
    fs.writeFileSync('route.json', JSON.stringify(routes, null, 2));
});
