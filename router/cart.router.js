import express from "express";
import multer from "multer";
import Cart from "../classes/cartItems.js";
import path from "path";

import { Router } from "express";
import Products from "../classes/products.js";

const cart = new Cart("cartItems.txt");
const productos = new Products("productos.txt");
const routerCart = Router();

//GET
routerCart.get("/", (req, res) => {
  //res.send(cart.getAll());
  const cartItems = cart.getAll();
  // res.render("cart", {
  //   urlProd: "prod",
  //   products: cartItems,
  // });
  res.send(cartItems);
});
routerCart.get("/:id", (req, res) => {
  let itemId = req.params.id;
  res.send(cart.getById(itemId));
});
routerCart.get("/:id/productos", (req, res) => {
  let itemId = req.params.id;
  let cartItemsObj = cart.getById(itemId);
  res.send(cartItemsObj);
});

//POST

const upload = multer();

routerCart.post("/", upload.none(), (req, res, next) => {
  const itemId = req.body.id;
  const items = productos.getAll();
  let itemAdd = items.filter((item) => item.id == itemId);
  console.log("cartrouter: ", itemAdd[0]);
  const objetoCreado = cart.save(itemAdd[0]);
  console.log("linea39: ", objetoCreado);
  if (objetoCreado) {
    //res.redirect("/");
    res.send(objetoCreado);
  } else {
    res.status(400);
    res.send("No se guardo la información");
  }
});

routerCart.post("/:id/productos", upload.none(), (req, res, next) => {
  let cartId = req.params.id;

  // const cartItems = cart.getAll();
  // const cartDetail = cartItems.filter((item)=> item.cartId == cartItems )
  // const cartDif = cartItems.filter((item)=> item.cartId != cartItems )

  const productId = req.body.id;
  const products = productos.getAll();
  const productDetail = products.filter((item) => item.id == productId);

  // const cartToPush = {
  //   ...cartDetail,
  //   productos: {
  //     productos,
  //     productDetail
  //   }
  // }

  const objetoCreado = cart.saveProduct(cartId, productDetail);
  console.log(objetoCreado);
  if (objetoCreado) {
    //res.redirect("/");
    res.send(objetoCreado);
  } else {
    res.status(400);
    res.send("No se guardo la información");
  }
});

//DELETE
routerCart.delete("/:id", (req, res) => {
  let itemId = req.params.id;
  cart.deleteById(itemId);
  res.send({ itemEliminado: itemId });
});

routerCart.delete("/:id/productos/:id_prod", (req, res) => {
  let cartId = req.params.id;
  let prodItem = req.params.id_prod;
  cart.deleteCartItem(cartId, prodItem);
  res.send({ itemEliminado: prodItem });
});

export default routerCart;
