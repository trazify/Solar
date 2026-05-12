import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
      },
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
      },
      cluster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cluster',
      },
    },
    items: [orderItemSchema],
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'cheque', 'card', 'upi', 'wallet'],
      default: 'bank_transfer',
    },
    deliveryStatus: {
      type: String,
      enum: ['not_assigned', 'assigned', 'in_transit', 'delivered', 'cancelled'],
      default: 'not_assigned',
    },
    installationStatus: {
      type: String,
      enum: ['not_assigned', 'assigned', 'in_progress', 'completed', 'pending'],
      default: 'not_assigned',
    },
    deliveryAssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    installerAssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deliveryDate: {
      type: Date,
      default: null,
    },
    installationDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
    subCategory: {
      type: String,
      default: null,
    },
    projectType: {
      type: String,
      default: null,
    },
    timeline: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
