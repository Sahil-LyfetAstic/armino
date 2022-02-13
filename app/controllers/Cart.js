import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    console.log(cart);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  console.log(req.body);

  const product = await Product.findOne({ id: req.body.product_id });
  const cart = await Cart.findOne({ user: req.user._id });

  let cartData = "";

  let validate = await checkValidation(
    req.body.product_id,
    req.body.qty,
    req.user._id,
    cart
  );
  if (validate.status === false) {
      console.log(validate.message)
    return res.json(validate);
  }

  try {
    
    if (cart) {
      let push = "";
      let productExist = cart.cart_items.find(
        (i) => i.product_id == req.body.product_id
      );
      if (!productExist) {
        push = {
          $push: {
            cart_items: {
              product_id: req.body.product_id,
              quantity: req.body.qty,
              price: product.price * req.body.qty,
            },
          },
        };

        cartData = await Cart.updateOne({ _id: cart._id }, push);
      } else {
        await Cart.updateOne(
          { _id: cart._id, "cart_items.product_id": req.body.product_id },
          {
            $inc: {
              "cart_items.$.quantity": req.body.qty,
              "cart_items.$.price": productExist.price * req.body.qty,
            },
          }
        );
      }
    } else {
      cartData = new Cart({
        user: req.user._id,
        cart_items: [
          {
            product_id: req.body.product_id,
            quantity: req.body.qty + productExist.quantity,
            price: product.price * req.body.qty+ productExist.price,
          },
        ],
      }).save();

      console.log(cartData, "cartData");
    }

    res.json(await Cart.find({ id: cartData.id }));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

async function checkValidation(id, quantity, userId, cart) {
  
  const product = await Product.findOne({ _id: id });
  let disscount = 0;
  const settings = product.settings;
  console.log(settings)
  let crt = "";
  if (settings.minQty) {
    if (quantity < settings.minQty) {
      return false;
    }
  }
  crt = await Cart.findOne({ user: userId });
  let Pro = crt.cart_items.find((i) => i.product_id == id);
  let price;
  Pro
    ? (price = Pro.price + product.price * quantity)
    : (price = product.price * quantity);


  if(settings.minQty){
    console.log(quantity)
  if(quantity < settings.minQty){
      let respose  = {
          message:"minimum qty is "+settings.minQty,
          status:false
          
      }
    return respose;
  }
}

  if (settings.upto) {
    if (settings.upto === price || price > settings.upto) {
      if (settings.discountPercentage) {
        disscount = (price * settings.discountPercentage) / 100;
        if (disscount > settings.maxLimit) {
          disscount = price - settings.maxLimit;
          console.log(disscount, "disscount");
          return;
        }
        disscount = price - disscount;
        console.log(disscount, "disscounfdfdfdffdt");
      }
    }
  }

  if (settings.discountPrice) {
    console.log(price, "price");
    disscount = 0;
    if (price >= settings.limitPrice) {
      disscount = price - settings.discountPrice;
      console.log(disscount, "disscount");
      console.log(cart)
      await Cart.updateOne(
        { _id: cart._id, "cart_items.product_id": id },
        {
        $set: {
            "cart_items.$.discount": settings.discountPrice,
        },
        }
        );

      return;
    }

    return disscount;
  }

  if (settings.maxQty) {
    if (quantity > settings.maxQty) {
        let respose  = {
            message:"maximum qty is "+settings.maxQty,
            status:false
            
        }
      return respose;
    }
  }


  return {
    disscount,
  };
}
