// Action identifiers
const SET_SELECTED_ORG = "SET_SELECTED_ORG";
const SET_SELECTED_REPO = "SET_SELECTED_REPO";
const SET_REPOS = "SET_REPOS";
const SET_COMMITS = "SET_COMMITS";
const SET_ERRORS = "SET_ERRORS";

export const actions = {
  SET_SELECTED_ORG,
  SET_SELECTED_REPO,
  SET_REPOS,
  SET_COMMITS,
  SET_ERRORS
}

// API options
const defaultPageSize = 100;
const baseUrl = "https://api.github.com"
const basicAuth = Buffer.from(`${process.env.REACT_APP_GH_CLIENT_ID}:${process.env.REACT_APP_GH_SECRET}`).toString('base64');
const fetchOptions = {
  headers: new Headers({ "Authorization": `Basic ${basicAuth}` })
};

// Direct actions
export const setSelectedOrg = (org) => { return { type: SET_SELECTED_ORG, payload: org }; }
export const setSelectedRepo = (repo) => { return { type: SET_SELECTED_REPO, payload: repo }; }
export const setRepos = (repos) => { return { type: SET_REPOS, payload: repos }; }
export const setCommits = (commits) => { return { type: SET_COMMITS, payload: commits }; }
export const setErrors = (errors) => { return { type: SET_ERRORS, payload: errors }; }

// Async actions (Thunks)
export const loadRepos = (org) => {
  return async (dispatch, getState) => {
    let loadingRepos = [], page = 1;
    const { selectedOrg } = getState();
    const url = `${baseUrl}/orgs/${selectedOrg}/repos`;
    while (page > -1) {
      const response = await fetch(`${url}?page=${page}&per_page=${defaultPageSize}`, fetchOptions);
      const json = await response.json();

      if (response.status === 200) {
        loadingRepos = loadingRepos.concat(json);

        if (json.length < defaultPageSize) {
          page = -1;
        } else {
          page++;
        }

        dispatch(setErrors([]));
      } else {
        page = -1;
        dispatch(setErrors([json.message]));
      }
    }

    loadingRepos.sort((a, b) => (a.open_issues_count < b.open_issues_count) ? 1 : -1);
    dispatch(setCommits([]));
    dispatch(setRepos(loadingRepos));
  };
};

export const loadCommits = (repo) => {
  return async (dispatch, getState) => {
    const { selectedOrg, selectedRepo } = getState();
    const url = `${baseUrl}/repos/${selectedOrg}/${selectedRepo.name}/commits`;
    const response= await fetch(`${url}?per_page=${defaultPageSize}`, fetchOptions);
    const json = await response.json();

    if (response.status === 200) {
      dispatch(setErrors([]));
      dispatch(setCommits(json));
    } else {
      dispatch(setErrors([json.message]));
    }
  };
}
