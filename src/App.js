import React from 'react';
import styles from './style.css';
import image from './images/OKAWARI.jpg';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'foo',
    };
  }
  render() {
    return (
      <div className={styles.app}>
        <div>barrrrrrrrrr</div>
        <img src={image} alt="placeholder"></img>
      </div>
    );
  }
}
