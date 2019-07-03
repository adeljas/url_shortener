import React from 'react';
import Shortener from '../Shortener';
import Expander from '../Expander';
import LatestEntries from '../LatestEntries';

import { Route, Link } from "react-router-dom";

const Homepage: React.FC = () => {
  return (
    <div className="App">
      <Link className="App-link" to="/">
        <div className="site-title">
          <span>URL</span>
          <small>Shortener</small>
        </div>
      </Link>
      <Route path="/:token" exact component={Expander} />
      <Shortener />
      <LatestEntries />
    </div>
  );
}

export default Homepage;
