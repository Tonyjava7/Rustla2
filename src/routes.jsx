import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Streams from './components/Streams';
import Stream from './components/Stream';
import Error404 from './components/Error404';
import Profile from './components/Profile';

import { fetchProfile, fetchStreamer } from './actions';
import store from './store';


const validServices = new Set(['angelthump', 'azubu', 'dailymotion', 'facebook', 'hitbox', 'hitbox-vod', 'mlg', 'nsfw-chaturbate', 'streamup', 'twitch', 'twitch-vod', 'ustream', 'vaughn', 'youtube', 'youtube-playlist']);

const routes =
  <Route path='/'>
    <IndexRoute component={Streams} />
    <Route path='strims' component={Streams} />
    <Route
      path='profile'
      getComponent={async (nextState, callback) => {
        try {
          const res = await store.dispatch(fetchProfile());
          if (res.error) {
            throw res.error;
          }
          return callback(null, Profile);
        }
        catch (e) {
          return callback(e);
        }
      }}
      />
    <Route
      path=':service/:channel'
      getComponent={(nextState, callback) => {
        const { service } = nextState.params;
        if (!validServices.has(service)) {
          return callback(null, Error404);
        }
        callback(null, Stream);
      }}
      />
    <Route
      path=':streamer'
      getComponent={async (nextState, callback) => {
        try {
          const { streamer } = nextState.params;
          if (!streamer) {
            throw new Error('`streamer` not specified by react-router');
          }
          const res = await store.dispatch(fetchStreamer(streamer));
          if (res.error) {
            throw res.error;
          }
          nextState.params.channel = res.payload.channel;
          nextState.params.service = res.payload.service;
          return callback(null, Stream);
        }
        catch (err) {
          console.error(err);
          return callback(null, Error404);
        }
      }}
      />
    <Route path='*' component={Error404} />
  </Route>
  ;

export default routes;
