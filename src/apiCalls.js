import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      "http://localhost:7000/api/auth/login",
      userCredential
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
  } catch (err) {
    dispatch({
      type: "LOGIN_FAILURE",
      payload: {
        message: JSON.parse(err.request.response).message,
        show: true,
      },
    });
  }
};
