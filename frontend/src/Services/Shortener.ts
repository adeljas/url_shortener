import Axios from 'axios';
import config from '../config';

const axios = Axios.create({
    baseURL: config.apiBaseUrl
});

export default class ShortenerService {

    shorten(url: string) {
        return axios.post('/api/shorten', {url}).then((res) => {
            return res.data;
        }).catch((err) => err);
    }

    expand(token: string) {
        return axios.get('/api/fetch-url?token='+token).then((res) => {
            return res.data;
        }).catch((err) => err);
    }

    latestEntries() {
        return axios.get('/api/latest-entries').then((res) => {
            return res.data;
        }).catch((err) => err);
    }
}
