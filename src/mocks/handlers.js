import { rest } from 'msw';

const repoFixtures = [
  {
    id: 12345,
    name: "cool_js",
    open_issues_count: 0
  },
  {
    id: 12346,
    name: "average_go",
    open_issues_count: 10
  },
  {
    id: 12347,
    name: "yikes_java",
    open_issues_count: 20
  }
];

const commitFixtures = [
  {
    sha: "1a2b3c4d5e",
    url: "https://example.com/1",
    commit: { 
      message: "Most recent commit",
      author: {
        date: "2020-10-10T00:00:00Z"
      }
    }
  },
  {
    sha: "2a2b3c4d6e",
    url: "https://example.com/2",
    commit: {
      message: "Slightly older commit",
      author: {
        date: "2019-10-10T00:00:00Z"
      }
    }
  },
  {
    sha: "3a2b3c4d7e",
    url: "https://example.com/3",
    commit: {
      message: "Initial commit",
      author: {
        date: "2019-10-10T00:00:00Z"
      }
    }
  }
];

export const handlers = [
  rest.get('https://api.github.com/orgs/test/repos', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(repoFixtures)
    );
  }),
  rest.get('https://api.github.com/orgs/rate_limit/repos', (req, res, ctx) => {
    return res(
      ctx.status(403),
      ctx.json({ message: "API rate limit exceeded" })
    );
  }),
  rest.get('https://api.github.com/repos/test/cool_js/commits', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(commitFixtures)
    );
  })
];
