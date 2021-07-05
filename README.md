# How Broke IS It?

-- 🔥🧯 --

When contributing to open source or joining a new team, a great way to find high-impact opportunities is to check the open issues list. Projects with lots of issues fall generally fall into two categories: VERY dead, or VERY active.

This app links up to the GitHub API and lets users browse an organization's public repos sorted by the number of open issues. Selecting a repo will show the latest 100 commits, to help determine if the repo is active enough to warrant support.

#### Check this app out live on [Glitch](https://how-broke-is-it.glitch.me/)! 🎏


## Setup & Details

This app is built with React v17 via [create-react-app](https://create-react-app.dev/).
It's a lightweight interface to the [GitHub REST API](https://docs.github.com/en/rest).

Local setup is a breeze! 💨🍃

```
git clone git@github.com/ATMartin/how-broke.git && cd $_
npm start
```

Now, the server is running at [localhost:3000](http://localhost:3000).


### Authentication

> ⚠️  Heads up! Running right away means you're in unauthenticated mode and limited to 60 requests/hour.
> That's pretty easy to chew through while browsing!

To get more bang for your buck, you'll need a client ID & secret from a [new GitHub OAuth app](https://github.com/settings/applications/new).

Create a copy of `.env.example` named `.env`, enter your new GitHub app ID & secret key, and restart the app.
Now you'll get 5000 requests/hour: still possible to exhaust, but plenty for casual use.

⚡️ Need more power? Read about GitHub's [API rate limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) and [authentication options](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#authentication).

## Tests

Automated tests are built on [Jest](https://jestjs.io/docs/tutorial-react) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), both integrated parts of create-react-app. Network mocking is added via [Mock Service Worker](https://mswjs.io/).

To run the entire suite, run the following command in the root directory:

```
npm test
```


## Opportunities for Improvement

<details>
<summary>🐙🐈 Better GitHub Integration</summary>
<p>
Right now, "How Broke" exists as an exclusvely frontend application. This is great for quick development & cheap hosting, but locks our authentication options due to CORS limitations. The ideal next step for this project would be to build a simple proxy server for React to route through, allowing us to implement GitHub's <a href="https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow">web application flow</a> and start thinking about how we might incorporate private repository access for individuals.
</p>
<p>
Honestly, the only limiting factor here is time: I'd rather deliver something decent-looking for users at the expense of technical complexity, but my next stop would be an Express/Flask/Gin app and a shiny new "Login with GitHub" button.
</p>
</details>

<details>
<summary>📊 Better Tests with Cypress</summary>
<p>
The tests here are pretty lame. They allowed me to verify behavior once the very initial proof-of-concept bits were in place, and and caught a number of regressions as I migrated from procedural to React-ish to Redux-ish architectures. They're sturdy enough to catch future refinements, but they're mostly "happy path" and do a poor job of testing edge cases or unexpected behavior - which, of course, are many  users' _favorite_ behaviors!
</p>
<p>
I'd love to throw a <a href="https://www.cypress.io/">Cypress</a> spec around this project, too. Right now, the app is using RTL and testing the one main component in semi-isolation. Cypress gives us true end-to-end testing and would make further changes a downright pleasure. I'm a little sad I didn't budget for this as part of the initial spec anyway!
</p>
</details>

<details>
<summary>🎒 Caching</summary>
<p>
We're making a whole bunch of API calls, often for the same info, in the course of using this app. Memoizing even a little bit of this data would make a huge difference. GitHub's API also supports <a href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api#conditional-requests">conditional requests</a>, which would save us on not only transfer volume but also rate limit consumption. That's pretty neat! 📸
</p>
</details>
