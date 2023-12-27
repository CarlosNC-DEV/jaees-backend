import CompanyModel from '../models/company.model.js';
import {responseError,responseSuccess} from "../middlewares/responses.default.js";

export const createCompany = async(req, res)=>{
    try {
        const companyModel = new CompanyModel(req.body);
        await companyModel.save();
    
        return responseSuccess(res, 200, "compañia creada exitosamente");
    
      } catch (error) {
        return responseError(res, 500, "error");
      }
}

export const getCompanyById = async (req, res) => {
  try {

    const getCompany = await CompanyModel.findById(req.params.id);

    return responseSuccess(res, 200, "compañia", getCompany);

  } catch (error) {
    return responseError(res, 500, "error");
  }
};

export const updateCompany = async(req, res)=>{
  try {
      const companyModel = await CompanyModel.findByIdAndUpdate(req.params.id, req.body)
      if(!companyModel){
        return responseError(res, 200, "no fue posible actualizar la compañia");
      }
  
      return responseSuccess(res, 200, "compañia actualizada exitosamente");
  
    } catch (error) {
      return responseError(res, 500, "error");
    }
}