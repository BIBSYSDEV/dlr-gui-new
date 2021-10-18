import React, { FC } from 'react';
import { Grid } from '@mui/material';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

interface SocialMediaSharingProps {
  resourceTitle: string;
  url: string;
}

const SocialMediaSharing: FC<SocialMediaSharingProps> = ({ resourceTitle, url }) => {
  return (
    <Grid container spacing={1}>
      <Grid item>
        <FacebookShareButton quote={resourceTitle} url={url}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </Grid>
      <Grid item>
        <TwitterShareButton url={url} title={resourceTitle}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </Grid>
      <Grid item>
        <LinkedinShareButton url={url} title={resourceTitle}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </Grid>
      <Grid item>
        <RedditShareButton url={url} title={resourceTitle}>
          <RedditIcon size={32} round />
        </RedditShareButton>
      </Grid>
      <Grid item>
        <EmailShareButton url={url} subject={resourceTitle} body="body">
          <EmailIcon size={32} round />
        </EmailShareButton>
      </Grid>
    </Grid>
  );
};

export default SocialMediaSharing;
