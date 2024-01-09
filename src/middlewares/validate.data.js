import { responseError } from "./responses.default.js";

// Authentication data
export const dataAuthentication = (req, res, next) => {
  const { indentification, password } = req.body;
  if (!indentification || !password) {
    return responseError(res, 200, "Todos los datos son requeridos");
  }

  next();
};

// Create new users
export const dataCreateUsers = (req, res, next) => {
  const { name, indentification, phone, password, createDate } = req.body;
  if (!name, !indentification || !phone || !password || !createDate) {
    return responseError(res, 200, "Todos los datos son requeridos");
  }

  next();
};

export const dataCreateLotteries = (req, res, next) => {
  const { name, dayGames, hoursGame, amountMax } = req.body;
  if (!name || !dayGames || !hoursGame || !amountMax) {
    return responseError(res, 200, "Todos los datos son requeridos");
  }

  next();
};

export const dataUpdateLotteries = (req, res, next) => {
  const { name, dayGames, hoursGame, amountMax } = req.body;
  if (!name || !dayGames || !hoursGame || !amountMax) {
    return responseError(res, 200, "Todos los datos son requeridos");
  }

  next();
};

export const dataCreateSales = (req, res, next) => {
  const { games, idSaller, createDate } = req.body;
  if (!games || !idSaller || !createDate) {
    return responseError(res, 200, "Todos los datos son requeridos");
  }

  next();
};

export const dataCreateAndUpdateCompany = (req, res, next) => {
  const { nit, register, name, phone, email, address } = req.body;
  if (!nit || !register || !name || !phone || !email || !address) {
    return responseError(res, 200, "Todos los datos son requeridos");
  }

  next();
};