/* eslint-disable react/style-prop-object */

import React, { Component } from 'react';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';
import './css/event.css';

class Event extends Component {
  render() {
    let title = this.props.event.summary;

    if (this.props.event.url && this.props.event.url !== '') {
      title = <a href={this.props.event.url}>{title}</a>;
    }

    if (this.props.event.major) {
      title = <b>{title}</b>;
    }

    let beginDate = this.props.event.start;
    let endDate = this.props.event.end;

    let endDateDisplay;
    if (endDate > beginDate) {
      let endDateDay;
      if (!(beginDate.getDate() === endDate.getDate() &&
        beginDate.getMonth() === endDate.getMonth() &&
        beginDate.getYear() === endDate.getYear())
      ) {
        endDateDay = (
          <span>
            <FormattedDate value={endDate} weekday='short' />
            {' '}
          </span>
        );
      }

      endDateDisplay = (
        <span>
          {' - '}
          {endDateDay}
          <FormattedTime value={endDate} />
        </span>
      );
    }

    let ongoingDisplay;
    if (Date.now() > beginDate) {
      ongoingDisplay = <span>{', '}<b>{'ongoing'}</b></span>;
    }

    let description = this.props.event.description;

    let descriptionDisplay;
    if (description && description !== '') {
      descriptionDisplay = (
        <p>
          <small>
            <i>
              {description}
            </i>
          </small>
        </p>
      );
    }

    return (
      <div className="event">
        <h4 className="title">{title}</h4>
        <p className="time">
          <FormattedDate value={beginDate} weekday='short' />
          {' '}
          <FormattedTime value={beginDate} />
          {endDateDisplay}
          {' ('}
          <FormattedRelative value={beginDate} style='numeric' />
          {ongoingDisplay}
          {'), '}
          {this.props.event.location}
        </p>
        {descriptionDisplay}
      </div>
    );
  }
}

Event.propTypes = { event: PropTypes.object.isRequired };

export default Event;
