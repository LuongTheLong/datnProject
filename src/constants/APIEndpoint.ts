const getURL = (path: string) => {
  return `${process.env.API_BASEURL!}/${path}`;
};

const authAPI = {
  login: getURL("api/coffeeDataHouse/login/login"),
};

const userAPI = {
  add: getURL("api/coffeeDataHouse/login/add-user"),
  getAll: getURL("api/coffeeDataHouse/login/get-list-users"),
  me: getURL("api/coffeeDataHouse/get-current-user/admins"),
};

export { authAPI, userAPI };
