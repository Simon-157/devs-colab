import axios from "axios";

export const getUser = async () => {
  const user = await axios({
    method: "get",
    url: "http://localhost:5000/user/current_user",
    withCredentials: true,
  });
  console.log(user);
  return user.data.user;
};
