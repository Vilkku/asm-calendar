import ical from 'ical';
import _ from 'lodash';
import storage from 'store/dist/store.modern';

export default function (state, action) {
  state = state || {
    events: [],
    locations: [],
    selectedLocations: [1, 11, 12],
    isFetching: false,
    lastUpdated: null,
    majorOnly: false
  };

  switch (action.type) {
    case 'REQUEST_EVENTS':
      return {
          ...state,
          isFetching: true
      };
    case 'RECEIVE_EVENTS': {
      let calendarData = ical.parseICS(action.data);
      let events = [];
      let locations = [];

      let locationsIndex = {};

      _.forOwn(calendarData, event => {
        let locationId;
        if (event.location) {
          if (locationsIndex[event.location]) {
            locationId = locationsIndex[event.location];
          } else {
            locationId = locations.length + 1;
            locationsIndex[event.location] = locationId;

            locations.push({
              value: locationId,
              label: event.location
            });
          }
        }

        let majorEvent = false;
        if (event.categories && event.categories.length > 0) {
          if (event.categories[0].indexOf('Major_event') !== -1) {
            majorEvent = true;
          }
        }

        events.push({
          ...event,
          locationId: locationId,
          major: majorEvent
        });
      });

      events = _.sortBy(events, ['start', 'summary']);

      return {
        ...state,
        events: events,
        locations: locations,
        isFetching: false,
        lastUpdated: Date.now()
      };
    }
    case 'SELECT_LOCATIONS': {
      storage.set('locations', action.locations);

      return {
        ...state,
        selectedLocations: action.locations
      };
    }
    case 'SELECT_MAJOR_ONLY': {
      storage.set('majorOnly', action.majorOnly);

      return {
        ...state,
        majorOnly: action.majorOnly
      };
    }
    default:
      return state;
  }
}
