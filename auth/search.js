const { User } = require("../mongoose/userDetailSchema");

exports.search = async (req, res, next) => {
  const searchValue = req.query.search;
  try {
    const users = await User.find({
      username: { $regex: new RegExp(searchValue, "i") },
    });
    console.log(req.query.search);
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error });
  }
};
