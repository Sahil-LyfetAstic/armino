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
    }


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
        cart,
    );
    if (validate.status === false) {
        console.log(validate.message)
        return res.json(validate);
    }
    if(settings.maxLimit < validate.discount){
        validate.discount = settings.maxLimit
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
                            price:product.price,
                            discount:validate.discount,
                            subtotal: product.price * req.body.qty,
                            grand_total:subtotal - discount
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
                        },
                        $set: {
                            "cart_items.$.discount": validate.discount,
                            "cart_items.$.subtotal": productExist.subtotal + product.price * req.body.qty,
                            "cart_items.$.grand_total":productExist.subtotal + product.price * req.body.qty - validate.discount
                        },
                    }
                );
                cartData = await Cart.findOne({ user: req.user._id });
            }
        } else {
            console.log(req.body)
            let subtotal = product.price * req.body.qty
            let  grandtotal = subtotal - validate.discount || subtotal - 0
            cartData = await Cart.create({
           
                user: req.user._id,
                cart_items: [
                    {
                        product_id: req.body.product_id,
                        quantity: req.body.qty,
                        price:product.price,
                        discount:validate.discount,
                        subtotal: subtotal,
                        grand_total:grandtotal
                    },
                ],
            });
        }
      cartData =  await Cart.findOne({ user: req.user._id });
        res.json(cartData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};



async function checkValidation(product_id, qty, user_id, cart,) {

    console.log(product_id)

    let product = await Product.findOne({ _id: product_id });
    const settings = product.settings;
    console.log(product)
    let cartData = "";
    let validate = {
        status: true,
        message: "",
    };
    let discount;
    let Pro = cart?.cart_items.find(
        (i) => i.product_id == product_id
    );

 

    if(settings.maxQty){
       

        if(Pro){
            if(Pro.quantity + qty > settings.maxQty){
                validate.status = false;
                validate.message = "Max Quantity Reached";
                validate.discout = Pro?.discount || 0;
                return validate;
            }
        }

        if(qty > settings.maxQty){
            validate.status = false;
            validate.message = "Max Quantity Reached";
            validate.discout = Pro?.discount || 0;
            return validate;
        }
    }


    if (settings.minQty) {
        if(qty < settings.minQty){
            validate.status = false;
            validate.message = "Minimum quantity is " + settings.minQty;
            validate.discout = Pro?.discount || 0;
            return validate;
        }
    }

    if(settings.upto){
        console.log("working    ")

        if(settings.discountPercentage){
            // if(settings.upto <= product.price || settings.upto  <= Pro?.subtotal+ product.price){
            //  let discount = product.price - (product.price * settings.discountPercentage / 100)
            //     console.log(product.price , 'discount')
            //     if(discount > settings.maxLimit){
            //         discount = settings.maxLimit
            //     }
                
            //     console.log(discount)
              
            //  }
            console.log("working 2")

            if(Pro?.subtotal >= settings.upto || Pro?.subtotal + product.price * qty >= settings.upto || product.price * qty >= settings.upto){
                console.log("eligible")

                 discount = product.price - (product.price * settings.discountPercentage / 100)
                 if(discount > product.maxLimit){
                    discount = product.maxLimit
                 }
            }
     

        }

        
        console.log(discount)

    
     }
     

     return {
        status: true,
       discount : discount
     }

}
