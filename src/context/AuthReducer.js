const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
      };
    case "REGISTER_START":
      return {
        user: null,
        isFetching: true,
      };
    case "REGISTER_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
      };
    case "REGISTER_FAILURE":
      return {
        user: null,
        isFetching: false,
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    case "LOGOUT":
      return {
        user: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;
