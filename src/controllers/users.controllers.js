import UserModel from '../models/users.model.js';
import RolesModel from '../models/rol.model.js';
import { responseSuccess, responseError } from '../middlewares/responses.default.js';
import usersModel from '../models/users.model.js';

export const createUsers = async(req, res)=>{
    try {

        const indentificationFound = await UserModel.findOne({indentification: req.body.indentification})
        if(indentificationFound){
            return responseError(res, 200, "Identificacion en uso")
        } 

        const usersModel = new UserModel(req.body);

        usersModel.password = await usersModel.hassPassword(req.body.password)

        if(req.body.rol){
            const rolFound = await RolesModel.find({name : {$in : req.body.rol}});
            usersModel.rol = rolFound.map((rol)=> rol._id);
        }else{
            const rolUser = await RolesModel.findOne({name: 'seller'});
            usersModel.rol = [rolUser._id]
        }

        await usersModel.save()
        
        return responseSuccess(res, 200, "Usuario creado exitosamente", null)

    } catch (error) {
        return responseError(res, 500, "error")
    }
}

export const authenticationUsers = async(req, res)=>{
    try {
        const usuarioFound = await UserModel.findOne({ indentification: req.body.indentification }).populate("rol");
        if(!usuarioFound){
            return responseError(res, 200, "Identificacion incorrecta")
        }

        const validatePass = await UserModel.validatePassword(req.body.password, usuarioFound.password);
        if(!validatePass){
            return responseError(res, 200, "Contraseña incorrecta")
        }

        const usuarioWithoutPassword = { ...usuarioFound._doc };
        delete usuarioWithoutPassword.password;
        delete usuarioWithoutPassword.password;

        return responseSuccess(res, 200, `Bienvenid@ ${usuarioFound.name}`, usuarioWithoutPassword)
        
    } catch (error) {
        return responseError(res, 500, "error")
    }
}

export const getUserById = async(req, res)=>{
    try {

        const userFound = await usersModel.findById(req.params.id).populate("rol").select("-password")
        return responseSuccess(res, 200, "Usuario encontrado", userFound)
        
    } catch (error) {
        return responseError(res, 500, "error")
    }
}