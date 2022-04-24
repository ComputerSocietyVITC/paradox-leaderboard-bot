# paradox leaderboard bot

1. hits the azure server every x(you define it) minutes so azure doesn't decommission resources.
2. shows leaderboard in a channel in discord server (you define it)


**Environment variables**

TOKEN=the_discord_bot_token

WRITING_CHANNEL_ID=the channel id we're writing it to

LEADERBOARD_URI=the uri from which we are getting the leaderboard

REFRESH_TIME=the time interval at which to hit the server (in milliseconds)

**Running**

`yarn` followed by `yarn build` followed by `yarn start`
