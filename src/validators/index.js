const { z } = require("zod");

//auth

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

//restaurants

const createRestaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters").optional(),
});

//menu

const createMenuItemSchema = z.object({
  name: z.string().min(2, "Menu item name must be at least 2 characters"),
  price: z.number().positive("Price must be positive"),
  restaurantId: z.number().int().positive("Restaurant ID must be valid"),
});

//orders

const createOrderSchema = z.object({
  restaurantId: z.number().int().positive("Restaurant ID must be valid"),
  items: z.array(
    z.object({
      menuItemId: z.number().int().positive("Menu item ID must be valid"),
      quantity: z.number().int().positive("Quantity must be at least 1"),
    })
  ).min(1, "Order must contain at least one item"),
});

const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PLACED",
    "ACCEPTED",
    "PICKED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

module.exports = {
  registerSchema,
  loginSchema,
  createRestaurantSchema,
  createMenuItemSchema,
  createOrderSchema,
  updateOrderStatusSchema,
};