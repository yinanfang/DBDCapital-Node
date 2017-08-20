// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import CodeIcon from 'material-ui/svg-icons/action/code';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import $ from 'jquery';

import styleCSS from '../style.css';

const GCSection = (props: any) => {
  const SECTION_PADDING = 20;

  /**
   * Toggle closest form within accountSectionContainer
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  const toggleSectionDescriptionAndContent = (event) => {
    // Find closest parent div with id starting with 'section_'
    const formElement = $(event.target).closest('div[id^=section_]');
    // Go to children div and toggle
    formElement.find('#sectionContent').first().slideToggle();
    formElement.find('#sectionDescription').first().slideToggle();
    console.log('touched');
  };

  return (
    <Paper id={`section_${props.idSuffix}`} className={styleCSS.section}>
      <Toolbar id="sectionTitle" onTouchTap={toggleSectionDescriptionAndContent}>
        <ToolbarGroup>
          <ToolbarTitle text={props.title} />
        </ToolbarGroup>
        <ToolbarGroup>
          <IconButton touch tooltip="Expand">
            <CodeIcon />
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
      <div
        id="sectionContent" style={{
          display: 'none', // Hide at first
          backgroundColor: '#f7f7f7',
          padding: `${SECTION_PADDING}px`,
        }}
      >
        {props.children}
      </div>
      <div id="sectionDescription" style={{ padding: `${SECTION_PADDING}px` }}>{props.description}</div>
    </Paper>
  );
};

GCSection.propTypes = {
  // Injected by React Redux
  // TODO: mark this as required
  children: PropTypes.node.isRequired, // eslint-disable-line react/require-default-props
  // Injected by React Redux
  title: PropTypes.string.isRequired,
  idSuffix: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default GCSection;
