import React, { Component } from 'react';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';

class Event extends Component {
  weekdays: {
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
    7: 'Sun'
  }
  render() {
    var title = this.props.event.SUMMARY;

    if (this.props.event.URL) {
      title = <a href={this.props.event.URL}>{title}</a>;
    }

    var beginDate = new Date(this.props.event.DTSTART * 1000);
    var endDate = new Date(this.props.event.DTEND * 1000);

    //           {beginDate.toString() + ' - ' + endDate.toString()}</p>

    return (
      <div>
        <h3>{title}</h3>
        <p>
          <FormattedDate value={beginDate} weekday='short' />{' '}
          <FormattedTime value={beginDate} />{' - '}
          <FormattedDate value={endDate} weekday='short' />{' '}
          <FormattedTime value={endDate} />{' ('}
          <FormattedRelative value={beginDate} style='numeric' />{')'}
        </p>
      </div>
    );
  }
}

Event.propTypes = { event: React.PropTypes.object.isRequired };

export default Event;
