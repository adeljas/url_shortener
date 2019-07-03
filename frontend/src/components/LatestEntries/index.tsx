import React from 'react';
import ShortenerService from '../../Services/Shortener';
import { baseUrl } from '../../Helpers/Url';
import { Link } from "react-router-dom";
import './styles.css';

interface ViewState {
    latestEntries: []
}

interface UrlEntry {
    token: string;
    source_url: string;
    created_at: string;
    user_agent: string;
}

class Expander extends React.Component<{}, ViewState> {

  private api: ShortenerService;

  public constructor(props: {}) {
    super(props);

    this.state = {
        latestEntries: []
    };

    this.api = new ShortenerService();
    this.fetchLatestEntries = this.fetchLatestEntries.bind(this);
  }

  private async fetchLatestEntries() {
    const response = await this.api.latestEntries();
    this.setState({latestEntries: response.latestEntries});
  }

  private renderEntries(){
    return this.state.latestEntries.map((item: UrlEntry, index)=>
        <tr key={index}>
            <td><a href={item.source_url}>{item.source_url}</a></td>
            <td><Link to={item.token}>{baseUrl}{item.token}</Link></td>
            <td>{item.created_at}</td>
        </tr>
    );
  }

  private renderHeader(){
    return (
        <tr>
            <th>URL</th>
            <th>Token</th>
            <th>Creation Date</th>
        </tr>
    );
  }

  componentDidMount() {
    this.fetchLatestEntries();
  }

  render() {
    return this.state.latestEntries.length > 0 ? (
      <div className="latest-entries">
        <table>
            <thead>
                {this.renderHeader()}
            </thead>
            <tbody>
                {this.renderEntries()}
            </tbody>
        </table>
      </div>
    ) : '';
  }

}

export default Expander;
