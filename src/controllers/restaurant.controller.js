const prisma = require("../prisma");

const createRestaurant = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    const restaurant = await prisma.restaurant.create({
      data: { name, location }
    });

    res.status(201).json({
      message: "Restaurant created",
      restaurant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { isActive: true }
    });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants
};
