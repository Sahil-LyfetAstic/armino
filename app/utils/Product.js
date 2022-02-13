const products = [
  {
    name: "Notebook",
    slug: "notebook",
    description:
      "This is a notebook. It has a very nice screen and a keyboard. It is very light and has a lot of space.",
    price: 100,
    settings: {
      minQty: 3,
      upto:500,
      discountPercentage: 10,
      maxLimit: 60,
    },
  },
  {
    name: "Sanitizer",
    slug: "sanitizer",
    description:
      "This is a sanitizer. It is very good for cleaning your hands.",
    price: 250,
    settings: {
      minQty: 10,
      limitPrice:3000,
      discountPrice: 100,
    },
  },
  {
    name: "Bag",
    slug: "bag",
    description: "This is a bag. It is very good for carrying your things.",
    price: 1500,
    settings: {
      maxQty: 2,
    },
  },
];

export default products;
