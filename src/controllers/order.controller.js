const prisma = require("../prisma");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { restaurantId, items } = req.validatedData;

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

      const itemTotal = Number(menuItem.price) * item.quantity;
      totalAmount += itemTotal;

      return {
        menuItemId: menuItem.id,
        quantity: item.quantity,
        unitPrice: menuItem.price
      };
    });

    totalAmount = Number(totalAmount.toFixed(2));

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
    const { status } = req.validatedData;
    const orderId = Number(req.params.id);

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = existingOrder.status;

    const allowedTransitions = {
      PLACED: ["ACCEPTED", "CANCELLED"],
      ACCEPTED: ["PICKED", "CANCELLED"],
      PICKED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: []
    };

    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Invalid transition from ${currentStatus} to ${status}`
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    res.json(updatedOrder);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update order" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus
};
