import bcrypt from "bcryptjs";

const users = [
  {
    name: "Leon Zaichik",
    email: "leon@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Daniel Ivannikova",
    email: "daniel@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Liam Zaichik",
    email: "liam@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
