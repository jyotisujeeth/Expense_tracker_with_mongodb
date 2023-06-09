const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  paymentid: Sequelize.STRING,
  orderid: Sequelize.STRING,
  status: Sequelize.STRING,
});
module.exports = Order;


























// const mongoose=require('mongoose');
// const Schema=mongoose.Schema;

// const Order=new Schema({
//     paymentid:{
//         type:String
//     },
//     orderid:{
//         type:String
//     },
//     status:{
//         type:String
//     },
//     userId:{
//         type:Schema.Types.ObjectId,
//         ref:'User',
//         required:true
//     }
// })
// module.exports=mongoose.model('Order',Order);





// // const Sequelize = require('sequelize');
// // const sequelize = require('../util/database');


// // const Order = sequelize.define('order', {
// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true
// //     },
// //     paymentid: Sequelize.STRING,
// //     orderid: Sequelize.STRING,
// //     status: Sequelize.STRING
// // })

// // module.exports = Order;





