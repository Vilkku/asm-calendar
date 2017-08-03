export function fetchEvents () {
  return { type: 'REQUEST_EVENTS' }
}

export function selectLocations (locations) {
    return { type: 'SELECT_LOCATIONS', locations };
}

export function selectMajorOnly (majorOnly) {
    return { type: 'SELECT_MAJOR_ONLY', majorOnly };
}
