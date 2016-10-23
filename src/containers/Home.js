import React from 'react';
import { connect } from 'react-redux';
import styles from '../style.css';
import image from '../images/OKAWARI.jpg';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'foo',
    };
  }
  render() {
    return (
      <div className={styles.app}>
        <h1>Home</h1>
        <img src={image} alt="placeholder"></img>
      </div>
    );
  }
}

export default connect()(Home);
