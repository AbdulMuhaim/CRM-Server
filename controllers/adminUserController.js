const User = require("../modals/adminUserModal");
const jwt = require("jsonwebtoken");
const get = require("lodash");
const { customRandom } = require('nanoid');
const seedrandom = require('seedrandom');


const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const findUser = await User.find({ name });

    if (findUser.length !== 0) {
      return res.status(500).send({ message: "User already exists" });
    } else {
      // Use the current timestamp as a seed
      const seed = String(Date.now());
      const rng = seedrandom(seed);
      const nanoid = customRandom('BROMAGINDIA', 5, size => {
        return new Uint8Array(size).map(() => 256 * rng());
      });

      const uniqueId = nanoid(); // Generate a short and unique ID

      const result = await User.create({ ...req.body, uniqueId });
      return res.status(200).send({ message: result, uniqueId });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .send({ message: "Something went wrong while creating a new user" });
  }
};




const getUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, password } = req.body;
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).send({ message: "Incorrect password" });
    }


    const isAdmin = user.name.toLowerCase().startsWith("admin")

    const token = jwt.sign(
      {
        userId: user?._id,
        name: user?.name,
        mobileNumber: user?.mobileNumber,
        email: user?.email,
        city: user?.city,
        state: isAdmin?user.name.split('@')[1]:user.state,
        adminId: user?.adminId,
        role: user?.role
      },
      process.env.SECRET_KEY,
      { expiresIn: "10000h" }
    );
    res.status(200).send({ message: token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { createUser, getUser };
