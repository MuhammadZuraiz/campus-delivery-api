const prisma = require("../prisma");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { restaurantId, items } = req.body;

    if (!restaurantId || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // fetch menu items to get prices
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: items.map(i => i.menuItemId) }
      }
    });

    let totalAmount = 0;

    const orderItemsData = items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);

      if (!menuItem) {
        throw new Error("Invalid menu item");
      }

      totalAmount += menuItem.price * item.quantity;

      return {
        menuItemId: menuItem.id,
        quantity: item.quantity,
        unitPrice: menuItem.price
      };
    });

    const order = await prisma.order.create({
      data: {
        customerId: userId,
        restaurantId,
        totalAmount,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create order" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        items: {
          include: { menuItem: true }
        }
      }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = Number(req.params.id);

    const allowedStatuses = [
      "PLACED",
      "ACCEPTED",
      "PICKED",
      "DELIVERED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Could not update order" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus
};
