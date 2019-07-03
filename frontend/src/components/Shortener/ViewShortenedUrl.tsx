import React from 'react';
import { baseUrl } from '../../Helpers/Url';
import { Link } from "react-router-dom";

interface ViewShortenedUrlProps {
    tokenUri: string,
}

const ViewShortenedUrl: React.SFC<ViewShortenedUrlProps> = (props: ViewShortenedUrlProps) => {
    return props.tokenUri ? (
        <div className="shortener_shortened-url-wrapper">
            <span>Your Shortened URL : </span><Link to={props.tokenUri}>{baseUrl}{props.tokenUri}</Link>
        </div> 
    ) : null;
}

export default ViewShortenedUrl;
