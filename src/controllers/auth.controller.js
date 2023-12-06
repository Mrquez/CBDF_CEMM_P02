const Usuario = require("../models/aut.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "HolaMundojujui";
exports.login = async(req,res)=>{
    try{
        const { correo, clave } = req.body;
    if (correo == undefined || clave == undefined) {
      res.status(400).json({ mensaje: "Faltan parametros" });
    } else {
      const usuario = await Usuario.findOne({ correo });
      if (usuario) {
        const claveDB = usuario.clave;
        if (claveDB) {
          const claveCorrect = await bcrypt.compare(clave, claveDB);
          const payload = {
            userId: usuario._id,
            userName: usuario.nombre,
            userLastname: usuario.apellidos,
            usercorreo: usuario.correo,
            userUser: usuario.usuario
          };
          const token = jwt.sign(payload, secretKey);
          if (claveCorrect) {
            res
              .status(200)
              .json({ estado: 1, mensaje: "se inició sesion exitosamente", token: token });
          } else {
            res.status(401).json({ estado: 0, mensaje: "No autorizado" });
          }
        } else {
          res
            .status(400)
            .json({ estado: 0, mensaje: "Contraseña erronea" });
        }
      } else {
        res.status(404).json({ estado: 0, mensaje: "Usuario no enontrado" });
      }
    }

}
    catch(error){
console.log(error);
res.status(500).json({
    estado:0,
    mensaje:"Ocurrio un error desconcido"
        })
    }
}
