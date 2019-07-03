import React from 'react';
import { validateUrl } from '../../Helpers/Url';
import ShortenerService from '../../Services/Shortener';
import ViewShortenedUrl from './ViewShortenedUrl';
import './styles.css';

interface ViewState {
  url: string;
  tokenUri: string;
  valid: boolean;
}

class Shortener extends React.Component<{}, ViewState> {

  private api: ShortenerService;

  public constructor(props: {}) {
    super(props);

    this.state = {
      url: '',
      tokenUri: '',
      valid: true
    };

    this.api = new ShortenerService();

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleUrlSubmit = this.handleUrlSubmit.bind(this);
  }

  private async shorten(url: string) {
    const response = await this.api.shorten(url);
    this.setState({tokenUri: response.tokenUri});
}

  private handleUrlSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (validateUrl(this.state.url)) {
      this.shorten(this.state.url);
    } else {
      this.setState({valid: false});
    }

    event.preventDefault();
    return false;
  }

  private handleUrlChange(event: React.FormEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    this.setState({url: target.value, tokenUri: '', valid: true});
  }
  

  render() {
    return (
      <div className="shortener">
        <form onSubmit={this.handleUrlSubmit}>
          <div>
            <input 
              className={this.state.valid ? 'textbox' : 'textbox--invalid'}
              placeholder="enter a link to shorten" 
              autoComplete="off" 
              onChange={this.handleUrlChange} 
              value={this.state.url} 
              type="text" 
              name="input_url" />
            <button>Shorten !</button>
          </div>

          <ViewShortenedUrl tokenUri={this.state.tokenUri} />
        </form>
      </div>
    );
  }

}

export default Shortener;
