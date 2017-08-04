import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Event from './Event';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { selectLocations, selectMajorOnly } from './actions/events';
import './css/app.css';

const updateInterval = 60000;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.filterEvents(props.events),
      lastUpdate: Date.now()
    };
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
    this.refreshFilteredEvents = this.refreshFilteredEvents.bind(this);
    this.handleMajorOnlyChange = this.handleMajorOnlyChange.bind(this);
  }

  componentDidMount() {
    setTimeout(this.refreshFilteredEvents, updateInterval);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      events: this.filterEvents(nextProps.events),
      lastUpdate: Date.now()
    });
  }

  filterEvents(events) {
    return events.filter(event => {
      return event.end > Date.now();
    });
  }

  refreshFilteredEvents() {
    // Don't update too often
    let now = Date.now();
    if (this.state.lastUpdate + 5000 < now) {
      this.setState({
        events: this.filterEvents(this.state.events),
        lastUpdate: now
      });
    }

    setTimeout(this.refreshFilteredEvents, updateInterval);
  }

  handleLocationSelect(values) {
    let selectedLocations = values.map(value => value.value);
    this.props.onSelectLocations(selectedLocations);
  }

  handleMajorOnlyChange(event) {
    this.props.onSelectMajorOnly(event.target.checked);
  }

  render() {
    return (
      <div>
        <div className="row locations">
          <div className="col-md-8 col-lg-9">
            <Select
              name='location-select'
              value={this.props.selectedLocations}
              options={this.props.locations}
              onChange={this.handleLocationSelect}
              multi={true}
            />
          </div>
          <div className="col-md-4 col-lg-3">
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={this.props.majorOnly}
                  onChange={this.handleMajorOnlyChange}
                />
                {' Show only major events'}
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            {this.state.events.map(event => {
              return (
                <Event key={event.uid} event={event} />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  events: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  selectedLocations: PropTypes.array.isRequired,
  majorOnly: PropTypes.bool.isRequired,
  onSelectLocations: PropTypes.func.isRequired,
  onSelectMajorOnly: PropTypes.func.isRequired
};

var mapStateToProps = function (state) {
  const selectedLocations = state.events.selectedLocations;
  const majorOnly = state.events.majorOnly;

  return {
    events: state.events.events.filter(event => {
      return (selectedLocations.indexOf(event.locationId) !== -1 || selectedLocations.length === 0) &&
        ((majorOnly && event.major) || !majorOnly);
    }),
    locations: state.events.locations,
    selectedLocations: selectedLocations,
    majorOnly: majorOnly
  };
};

var mapDispatchToProps = function (dispatch) {
  return {
    onSelectLocations: function (locations) {
      dispatch(selectLocations(locations));
    },
    onSelectMajorOnly: function (majorOnly) {
      dispatch(selectMajorOnly(majorOnly));
    }
  };
};

var AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
