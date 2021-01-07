---
title: "Unit Testing redux-persist migrations with Typescript"
date: "2020-07-05T17:00:00.000Z"
layout: post
draft: false
path: "/posts/unit-testing-redux-persist-migrations-with-typescript"
category: "Testing"
tags:
  - "Unit Testing"
  - "Typescript"
  - "React"
description: "redux-persist allows you to specify a migration path between versions, but how can you do that in a strongly-typed way through Typescript?"
---

`redux-persist` is [a popular library](https://github.com/rt2zz/redux-persist) which allows you to persist your Redux store to several different storage methods. When you change the structure of your data, ideally you'd like that to be invisible to the user. In order to avoid losing data when the structure changes, redux-persist provides the ability to [define your own migrations](https://github.com/rt2zz/redux-persist/blob/master/docs/migrations.md). In a world of Javascript this poses no problem but as soon as you add Typescript into the mix, things get a little bit hairier. Typescript allows us to define types and reference them, but how do we do that in a scenario where one type is - by definition - removed from the code base?

Consider the hypothetical redux store which corresponds to the following type `StoreState`:

```js
{
    user: {
        id: string;
    };
    videoPlayer: {
        ui: {
            currentVideoId: string;
        };
        allVideos: string[];
    };
}
```

I don't quite like the structure here and want to make some changes to the structure and naming, i.e. I want this instead:

```js
{
    user: {
        id: string;
    };
    videoPlayer: {
        currentVideoId: string;
        videos: string[];
    };
}
```

In order to write a strongly-typed migration, I can now write a migration that looks like this:

```js
import { StoreState } from './StoreState';

export type V0StoreState = {
  [P in keyof Omit<StoreState, 'videoPlayer'>]: StoreState[P];
} & {
  videoPlayer: {
        ui: {
            currentVideoId: string;
        };
        allVideos: string[];
    };
};

export function v1(state: V0StoreState): StoreState {
  return {
    ...state,
    videoPlayer: {
      currentVideoId: state.videoPlayer.ui.currentVideoId,
      videos: state.videoPlayer.allVideos
    },
  };
}
```

What's key here is that we define the old version of our state as exactly the current one, minus the part that we've changed. We then extend it with the structure of that property in the prior version. An alternative approach here would be to just copy the entire `StoreState` and keep multiple versions of it around, that's up to your own discretion.

At this point your migration between redux-persist versions will be strongly typed but we're still missing some useful goodies: how would we unit test this?
The slightly tricky bit here will be to make the differnet `StoreState` versions play nice. In the below example, `createMockState()` returns a default state of type `StoreState`. We then augment that with the old state -- the type of which we can directly reference using `V0StoreState['videoPlayer']`. Typescript's type interference can then correctly guarantee that the types are compatible with both the new and the old version of the state at any point in the code.

```js
import { v1, V0StoreState } from '../reduxMigrations';
import createMockState from './createMockState';

describe('reduxMigrations', () => {
  describe('v1', () => {
    it('converts the currentVideoId', () => {
      const oldVideoPlayerState: V0StoreState['videoPlayer'] = {
        ui: {
          currentVideoId: 'video1',
        },
        allVideos: ['video1'],
      };

      const oldState: V0StoreState = {
        ...createMockState(),
        videoPlayer: oldVideoPlayerState,
      };

      const newState = v1(oldState);

      expect(newState.videoPlayer.currentVideoId).toBe('video1');
    });
  });
});
```

That's it. From this point on you can define new versions of your store whenever you make a change to its structure and write strongly typed code against both the migration as well as its tests.