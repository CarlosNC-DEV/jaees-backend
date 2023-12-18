

export const responseSuccess = (res, statusCode, message, data) =>{
    res.status(statusCode).json({
        status:true,
        message:message,
        data:data
    })
}

export const responseError = (res, statusCode, message) =>{
    res.status(statusCode).json({
        status:false,
        message:message,
        data:null
    })
}