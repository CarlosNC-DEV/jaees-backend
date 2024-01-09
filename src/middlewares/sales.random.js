import SaleSchema from "../models/sales.model.js";

export async function generateCode() {
  try {
    const count = await SaleSchema.countDocuments();
    const codeGenerate = count + 1;
    const uniqueCode = await findUniqueCode(codeGenerate);
    return uniqueCode;
  } catch (error) {
    throw error;
  }
}

// Función recursiva para encontrar un código único
const findUniqueCode = async (code) => {
  const codeFound = await SaleSchema.findOne({ code });
  if (codeFound) {
    return findUniqueCode(code + 1);
  } else {
    return code;
  }
};

export async function generateUniqueRandomCode(length) {
  while (true) {
    const randomCode = generateRandomCode(length);

    // Verificar si el código ya existe en la base de datos
    const existingDocument = await SaleSchema.findOne({
      codeSecure: randomCode,
    });

    if (!existingDocument) {
      return randomCode;
    }
  }
}

function generateRandomCode(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
