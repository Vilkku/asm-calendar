import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import _ from 'lodash';
import Event from './Event';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      events: [],
      loaded: false,
      error: false,
      selectedAreas: [0, 7, 12],
      filteredEvents: []
    };
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
  }
  componentDidMount() {
    $.ajax({url: 'http://vilkku.kapsi.fi/asm/index.php?format=json'})
      .done(data => {
        if (data.locations && data.events) {
          var filteredEvents = this.filterEvents(data.events, this.state.selectedAreas);

          this.setState({
            locations: data.locations,
            events: data.events,
            loaded: true,
            error: false,
            filteredEvents: filteredEvents
          });

          setTimeout(this.refreshFilteredEvents.bind(this), 60000);
        } else {
          this.setState({loaded: true, error: true});
        }
      })
      .fail(data => {
        this.setState({loaded: true, error: true});
      });
  }
  filterEvents(events, selectedAreas) {
    return _.filter(events, event => {
      return event.DTEND*1000 > Date.now() && selectedAreas.indexOf(event.location_id) > -1;
    });
  }
  refreshFilteredEvents() {
    var filteredEvents = this.filterEvents(this.state.events, this.state.selectedAreas);
    this.setState({filteredEvents: filteredEvents});

    setTimeout(this.refreshFilteredEvents.bind(this), 60000);
  }
  handleLocationSelect(values) {
    var selectedAreas = values.map(value => {return value.value;});
    var filteredEvents = this.filterEvents(this.state.events, selectedAreas);

    this.setState({selectedAreas: selectedAreas, filteredEvents: filteredEvents});
  }
  render() {
    console.log(this.state);

    return (
      <div className="App">
        <div>
          <Select
            name='location-select'
            value={this.state.selectedAreas}
            options={this.state.locations.map(location => {
              return {
                value: location.id,
                label: location.name
              };
            })}
            onChange={this.handleLocationSelect}
            multi={true}
          />
        </div>
        <div>
          {this.state.filteredEvents.map(event => {
            return (
              <Event key={event.id} event={event} />
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
