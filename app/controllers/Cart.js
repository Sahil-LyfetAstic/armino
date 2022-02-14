
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

//create a get cart function

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  console.log(req.body);

  const product = await Product.findOne({ id: req.body.product_id });
  const cart = await Cart.findOne({ user: req.user._id });
  const settings = product.settings;

  let cartData = "";

  let validate = await checkValidation(
    req.body.product_id,
    req.body.qty,
    req.user._id,
    cart
  );
  if (validate.status === false) {
    console.log(validate.message);
    return res.json(validate);
  }

  console.log(validate.discount, "validate discount");

  try {
    if (cart) {
      let push = "";
      let productExist = cart.cart_items.find(
        (i) => i.product_id == req.body.product_id
      );
      let subtotal = product.price * req.body.qty;
      let grandtotal = subtotal - validate.discount || subtotal - 0;
      console.log(subtotal, "subtotal");
      console.log(validate.discount, "validate.discount");
      console.log(grandtotal, "grandtotal");

      if (!productExist) {
        console.log("working 1");
        push = {
          $push: {
            cart_items: {
              product_id: req.body.product_id,
              quantity: req.body.qty,
              price: product.price,
              discount: validate.discount,
              subtotal: product.price * req.body.qty,
              grand_total: grandtotal,
            },
          },
        };

        // cartData = await Cart.updateOne({ _id: cart._id }, push);
      } else {
        console.log("working 2");
        await Cart.updateOne(
          { _id: cart._id, "cart_items.product_id": req.body.product_id },
          {
            $inc: {
              "cart_items.$.quantity": req.body.qty,
            },
            $set: {
              "cart_items.$.discount": validate.discount,
              "cart_items.$.subtotal":
                productExist.subtotal + product.price * req.body.qty,
              "cart_items.$.grand_total":
                productExist.subtotal +
                  product.price * req.body.qty -
                  validate.discount ||
                productExist.subtotal + product.price * req.body.qty - 0,
            },
          }
        );
        // cartData = await Cart.findOne({ user: req.user._id });
      }
    } else {
      console.log(req.body);
      console.log("working 3");
      let subtotal = product.price * req.body.qty;
      let grandtotal = subtotal - validate.discount || subtotal - 0;
      cartData = await Cart.create({
        user: req.user._id,
        cart_items: [
          {
            product_id: req.body.product_id,
            quantity: req.body.qty,
            price: product.price,
            discount: validate.discount,
            subtotal: subtotal,
            grand_total: grandtotal,
          },
        ],
      });
    }
    cartData = await Cart.findOne({ user: req.user._id });
    let totalPrice = cartData.cart_items.reduce((acc, curr) => {
      return acc + curr.subtotal;
    }, 0);
    let totalTax = totalPrice * 0.1;
    let totalDiscount = cartData.cart_items.reduce((acc, curr) => {
      return acc + curr.discount;
    }, 0);
    let grandTotal = totalPrice + totalTax - totalDiscount;
    cartData.total_items = cartData.cart_items.length;
    cartData.total_price = totalPrice;
    cartData.total_tax = totalTax;
    cartData.discount = totalDiscount;
    cartData.grand_total = grandTotal;
    cartData.save();

    res.json(cartData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

async function checkValidation(product_id, qty, user_id, cart) {
  console.log(product_id);

  let product = await Product.findOne({ _id: product_id });
  const settings = product.settings;
  console.log(product);
  let cartData = "";
  let validate = {
    status: true,
    message: "",
  };
  let discount;
  let Pro = cart?.cart_items.find((i) => i.product_id == product_id);

  if (settings.maxQty) {
    if (Pro) {
      if (Pro.quantity + qty > settings.maxQty) {
        validate.status = false;
        validate.message = "Max Quantity Reached";
        validate.discout = Pro?.discount || 0;
        return validate;
      }
    }

    if (qty > settings.maxQty) {
      validate.status = false;
      validate.message = "Max Quantity Reached";
      validate.discout = Pro?.discount || 0;
      return validate;
    }
  }

  if (settings.minQty) {
    if (qty < settings.minQty) {
      validate.status = false;
      validate.message = "Minimum quantity is " + settings.minQty;
      validate.discout = Pro?.discount || 0;
      return validate;
    }
  }

  if (settings.upto) {
    console.log("working    ");

    if (settings.discountPercentage) {
      if (
        Pro?.subtotal >= settings.upto ||
        Pro?.subtotal + product.price * qty >= settings.upto ||
        product.price * qty >= settings.upto
      ) {
        console.log("eligible");

        discount =
          product.price - (product.price * settings.discountPercentage) / 100;
        if (discount > product.maxLimit) {
          discount = product.maxLimit;
        }

        if (settings.maxLimit < discount) {
          discount = settings.maxLimit;
        }
      }
    }
  }

  console.log(settings);
  if (settings.discountPrice) {
    console.log(Pro);
    if (
      Pro?.subtotal >= settings.limitPrice ||
      Pro?.subtotal + product.price * qty >= settings.limitPrice ||
      product.price * qty >= settings.limitPrice
    ) {
      discount = settings.discountPrice;
      console.log(discount, "discount of sanitizer");
    }
  }

  return {
    status: true,
    discount: discount,
  };
}



//create a coupen code discount from cart


    


    export const verifyCoupon = async (req, res) => {
        try {
            let  coupon =  await validateCoupon(req.body.coupon,req.user._id );
            console.log(coupon);
            
            res.send(coupon);
        } catch (error) {
            res.status(400).send(error);
        }
        }



async function validateCoupon(coupon,userId) {
    const coupen = 'PRIME123'

    if (coupon != coupen) {
        return {
            status: false,
            message: 'Invalid Coupon'
        }
    }
    const cart = await Cart.findOne({ user: userId });
    let discount = cart.discount + 123
    console.log(discount);

    console.log(cart.grand_total)
    if(cart.grand_total >= 10000  ){
      await cart.updateOne({
            $set: {
                discount: discount,
            }
        })
    
        return  cart
    }

    
    
}