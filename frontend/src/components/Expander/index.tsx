import React from 'react';
import ShortenerService from '../../Services/Shortener';
import './styles.css';

interface ViewState {
    originalUrl: string;
}

interface ViewProps {
    match: { params: { token: string } }
}

class Expander extends React.Component<ViewProps, ViewState> {

  private api: ShortenerService;

  public constructor(props: ViewProps) {
    super(props);

    this.state = {
        originalUrl: ''
    }

    this.api = new ShortenerService();
    this.fetchUrl = this.fetchUrl.bind(this);
  }

  private async fetchUrl(token: string) {
    const response = await this.api.expand(token);
    this.setState({originalUrl: response.url});
  }

  componentDidMount() {
    this.fetchUrl(this.props.match.params.token);
  }

  componentDidUpdate(prevProps: ViewProps) {
      if (this.props.match.params.token !== prevProps.match.params.token) {
          this.fetchUrl(this.props.match.params.token);
      }
  }

  render() {
    return this.state.originalUrl ? (
      <div className="expander">
        <a href={this.state.originalUrl} rel="noopener noreferrer" target="_blank">{this.state.originalUrl}</a>
      </div>
    ) : '';
  }

}

export default Expander;
