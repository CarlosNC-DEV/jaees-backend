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
  const { name, indentification, phone, password } = req.body;
  if ((!name, !indentification || !phone || !password)) {
    return responseError(res, 200, "Todos los datos son requeridos");
  }

  next();
};

export const dataCreateLotteries = (req, res, next) => {
  const { name, dayGames } = req.body;
  if ((!name, !dayGames)) {
    return responseError(res, 200, "Todos los datos son requeridos");
  }

  next();
};

export const dataCreateSales = (req, res, next) => {
  const { games, idSaller } = req.body;
  if ((!games, !idSaller)) {
    return responseError(res, 200, "Todos los datos son requeridos");
  }

  next();
};