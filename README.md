# MBTA

Web app that helps find upcoming MBTA departures of a given stop in real-time.

## Live Demo

See a live demo: [https://lesliemeng.github.io/mbta](https://lesliemeng.github.io/mbta)

![](https://github.com/lesliemeng/mbta/blob/master/src/images/1.png)

This project consists of 2 tabs: `Search` and `Favorites`. Users can see all Light and Heavy Rail trains and a list of their stops from the Search tab. Clicking on a stop will bring up departure times of both inbound & outbound schedules on the page. User has the option to add favorite stops to the Favorites tab for quick access.

## Requirements

1. Select from a list of routes that service only Light and Heavy Rail trains.

> View in Search tab.

2. Display a listing of stops related to the selected route and prompt the user to select a stop.

> View in Search tab or add stop to Favorites tab.

3. Display a list of route directions and prompt the user to select a direction.

> Click on a stop to view **both** inbound & outbound schedules. As someone who moved to Boston 4 years ago, I still get confused by which way is inbound vs outbound sometimes. So I kept the navigation as `Northbound` vs `Southbound`, and `Eastbound` vs `Westbound` for the routes.

> Schedule times for **both** directions are displayed when user selects a stop. This is useful in many cases. Ex: coworkers taking the T together after work, but going in different directions, can view departure time of the train from the same stop without having to navigate to a different page. While this goes against the original requirement, I proudly stand by my design choice.

4. Display the next predicted departure time for a train based on the previously selected inputs.

> View in Search tab or Favorites tab.

## Technical Explaination

The file `src/mbta/getRoutesAndStops.js` contains 2 APIs, and it is used to generate `src/mbta/route.json`, which has a list of filtered routes and stops, and is used to help render the Search tab.

Instead of fetching these same information everytime, I decided to store the list of filtered routes and stops in `route.json`, in order to minimize the amount of resources used and decrease the amount of time it takes to open the web app.

The departure times are updated everytime users click a specific stop. `src/components/Search.js` is triggered and calls the APIs in `scr/mbta/prediction.js` to grab real-time information.

### Using MBTA's API

Swagger Doc: https://api-v3.mbta.com/docs/swagger

#### How I Queried the API

##### /routes

This API is used in `src/mbta/getRoutesAndStops.js` to fetch the routes and stops and compile and format into `route.json`.

Ex: https://api-v3.mbta.com/routes

``` js
data[1] = {
  id: "Green-C",
  attributes: {
    direction_names: [
      "Westbound",
      "Eastbound"
    ]
  }
}
```

##### /stops

This is the data structure and the additional info fetched from this API. Queries are used to filter the routes.

Ex: https://api-v3.mbta.com/stops?filter[route]=Green-C

``` js
  data[13] = {
    id: "place-kencl",
    attributes: {
      name: "Kenmore"
    }
  }
```

``` js
  data[14] = {
    id: "place-hymnl",
    attributes: {
      name: "Hynes Convention Center"
    }
  }
```

##### /predictions (departure time)

This is the master API with queries used in `src/mbta/prediction.js` to fetch departure times from a selected stop with both directions: `inbound` and `outbound`.

As users clicks on a specific stop, the `prediction.js` will fetch the real time data from the API.

Ex: https://api-v3.mbta.com/predictions?filter[stop]=place-kencl&filter[direction_id]=0

``` js
  data[index].attributes = {
    departure_time: "2020-11-08T19:48:00-05:00",
    direction_id: 0
  }
```

##### After Hours

Display a link to the MBTA website of the chosen stop. Users will be able to view more information on the stop.

https://www.mbta.com/schedules/Orange/schedule?direction_id=0&origin=place-welln

## Cloning & Running Locally

```bash
$ git clone https://github.com/lesliemeng/mbta.git
$ cd [project directory]
$ npm install
$ npm run start
```

## Built With

* [React](https://reactjs.org/): Front-end JavaScript framework allowing for component based designs.
* [React-Redux](https://react-redux.js.org/): Offer bindings of React components and state management, reading data from a Redux store, and dispatching actions to the store to update data.
* [Material UI](https://material-ui.com/): Front-end framework containing readily-built UI and icon collections.
* [Node.js](https://nodejs.org/en/docs/): JavaScript runtime environment.

## Future Directions

I noticed that the MBTA V3 API provides a lot of useful information, such as longitude and latitude. If I were to work on this in the future, I'd add an intergration of google map. Overall, this is a really cool project, and I enjoyed working on it!

## Author

Leslie Meng [lmeng4@bu.edu](mailto:lmeng4@bu.edu)
