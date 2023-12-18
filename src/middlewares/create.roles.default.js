import Rol from '../models/rol.model.js';

(async()=>{
  try {
    const contador = await Rol.estimatedDocumentCount();

    if (contador > 0) {
      return;
    }

    await Promise.all([
      new Rol({ name: "seller" }).save(),
      new Rol({ name: "admin" }).save(),
    ]);

    console.log("roles creados")
    
  } catch (error) {
    console.error(error);
  }
})()