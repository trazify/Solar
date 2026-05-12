import Order from '../../models/orders/Order.js';
import Product from '../../models/inventory/Product.js';

const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `ORD-${Date.now()}-${count + 1}`;
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, user, state, cluster, district, category, timeline } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (user) filter.user = user;
    if (state) filter['customer.state'] = state;
    if (cluster) filter['customer.cluster'] = cluster;
    if (district) filter['customer.district'] = district;
    if (category) filter.category = category;
    if (timeline) filter.timeline = timeline;

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'name sku price')
      .populate('customer.state', 'name')
      .populate('customer.cluster', 'name')
      .populate('customer.district', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      user,
      customer,
      items,
      subTotal,
      tax,
      shippingCost,
      discount,
      paymentMethod,
      category,
      subCategory,
      projectType,
      timeline,
    } = req.body;

    let totalAmount = subTotal + (tax || 0) + (shippingCost || 0) - (discount || 0);

    const order = new Order({
      orderNumber: await generateOrderNumber(),
      user,
      customer,
      items,
      subTotal,
      tax: tax || 0,
      shippingCost: shippingCost || 0,
      discount: discount || 0,
      totalAmount,
      paymentMethod: paymentMethod || 'bank_transfer',
      category,
      subCategory,
      projectType,
      timeline,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    Object.assign(order, req.body);
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const { state, cluster, district } = req.query;
    let matchFilter = {};
    if (state) matchFilter['customer.state'] = new mongoose.Types.ObjectId(state);
    if (cluster) matchFilter['customer.cluster'] = new mongoose.Types.ObjectId(cluster);
    if (district) matchFilter['customer.district'] = new mongoose.Types.ObjectId(district);

    const totalOrders = await Order.countDocuments(matchFilter);
    const pendingOrders = await Order.countDocuments({ ...matchFilter, status: 'pending' });
    const completedOrders = await Order.countDocuments({ ...matchFilter, status: 'delivered' });

    const revenueMatch = { ...matchFilter, status: 'delivered' };
    const totalRevenue = await Order.aggregate([
      { $match: revenueMatch },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
