import { actions } from "./actions";

const initialState = {
  selectedOrg: "",
  selectedRepo: "",
  repos: [],
  commits: [],
  errors: []
};

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case actions.SET_SELECTED_ORG:
      return { ...state, selectedOrg: action.payload };
    case actions.SET_SELECTED_REPO:
      return { ...state, selectedRepo: action.payload };
    case actions.SET_REPOS:
      return { ...state, repos: action.payload };
    case actions.SET_COMMITS:
      return { ...state, commits: action.payload };
    case actions.SET_ERRORS:
      return { ...state, errors: action.payload };
    default:
      return state;
  }
}

export default reducer;
