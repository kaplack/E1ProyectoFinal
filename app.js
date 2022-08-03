import express from "express";

import Products from "./classes/products.js";
import routerProduct from "./router/products.router.js";
import routerCart from "./router/cart.router.js";

import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/uploads", express.static("uploads"));
app.use("/public", express.static("public"));

//Template Engines

const test1 = new Products("productos.txt");
const productos = test1.getAll();

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("main", {
    urlProd: "home",
  });
});

app.use("/api/productos", routerProduct);
app.use("/api/carrito", routerCart);

app.listen(8080);
