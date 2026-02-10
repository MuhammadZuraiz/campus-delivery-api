const prisma = require("../prisma");

const createMenuItem = async (req, res) => {
  try {
    const { name, price, restaurantId } = req.body;

    if (!name || !price || !restaurantId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        restaurantId
      }
    });

    res.status(201).json({
      message: "Menu item created",
      menuItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMenuByRestaurant = async (req, res) => {
  try {
    const restaurantId = Number(req.params.id);

    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId,
        isAvailable: true
      }
    });

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createMenuItem,
  getMenuByRestaurant
};
