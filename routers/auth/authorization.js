const roleModel = require("../../db/models/role");

//if it's admin or not
const authorization = async (req, res, next) => {
  try {
    //get token if role is admin then next
    const roleID = req.suha.role;
    const result = await roleModel.findById(roleID);
   
    if (result._id == "61a744fd313b1e7127be4636") {
      
      next();
    } else {
      res.status(403).json("forbidden");
    }
  } catch (err) {
    res.status(403).json(err);
  }
};

module.exports = authorization;
