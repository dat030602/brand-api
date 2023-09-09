const homeRouter = require('./Home');
const authenticationRouter = require('./Authentication');
const manageProductsRouter = require('./ManageProducts');
const manageVouchersRouter = require('./ManageVouchers');
const manageCustomersRouter = require('./ManageCustomers');
const voucherRouter = require('./Voucher');
const favoriteRouter = require('./Favorite');
const fileRouter = require('./File');
const searchRouter = require('./Search');
const cartRouter = require('./Cart');
const productRouter = require('./Product');
const userRouter = require('./User');
const manageOrdersRouter = require('./ManageOrders');
const loyaltyRouter = require('./Loyalty');
const refundOrderRouter = require('./RefundOrder');
const dashboardRouter = require('./Dashboard');
const personalInfodRouter = require('./PersonalInfo');

function route(app) {
  app.use('/home', homeRouter);
  app.use('/info', personalInfodRouter);
  app.use('/file', fileRouter);
  app.use('/product', productRouter);
  app.use('/authentication', authenticationRouter);
  app.use('/manage-products', manageProductsRouter);
  app.use('/manage-vouchers', manageVouchersRouter);
  app.use('/manage-customers', manageCustomersRouter);
  app.use('/favorite', favoriteRouter);
  app.use('/voucher', voucherRouter);
  app.use('/search', searchRouter);
  app.use('/my-cart', cartRouter);
  app.use('/user', userRouter);
  app.use('/dashboard', dashboardRouter);
  app.use('/manage-orders', manageOrdersRouter);
  app.use('/loyalty', loyaltyRouter);
  app.use('/refund', refundOrderRouter);
  app.use('/manage-customers', manageCustomersRouter);
}

module.exports = route;
