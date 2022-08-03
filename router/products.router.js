import express from "express";
import multer from "multer";
import Products from "../classes/products.js";
import path from "path";

import { Router } from "express";

const data = new Products("productos.txt");
const routerProduct = Router();

const validateAdmin = (req, res, next) => {
  if (req.headers.admin) {
    next();
  } else {
    res.status(400);
    res.send({ error: -1, decripcion: "Debe ser un admin" });
  }
};

//GET
routerProduct.get("/", (req, res) => {
  //res.send(data.getAll());
  const productos = data.getAll();
  res.render("productos", {
    urlProd: "prod",
    products: productos,
    listExists: true,
  });
});
routerProduct.get("/:id", (req, res) => {
  let itemId = req.params.id;
  res.send(data.getById(itemId));
});

//POST

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

routerProduct.post(
  "/",
  validateAdmin,
  upload.single("myFile"),
  (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload file");
      error.httpStatusCode = 400;
      return next(400);
    }

    let item = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock,
      code: req.body.code,
      thumbnail: file.path,
    };
    const objetoCreado = data.save(item);
    if (Object.keys(objetoCreado).includes("id")) {
      res.redirect("/");
      //res.send(objetoCreado);
    } else {
      res.status(400);
      res.send("No se guardo la información");
    }
  }
);

//PUT

routerProduct.put("/:id", validateAdmin, upload.none(), (req, res) => {
  let itemId = req.params.id;
  const body = req.body;
  test = {
    ...body,
    itemId,
  };

  data.updateById(itemId, body);

  res.send(data.updateById(itemId, body));
});

//DELETE
routerProduct.delete("/:id", validateAdmin, (req, res) => {
  let itemId = req.params.id;
  data.deleteById(itemId);
  res.send({ itemEliminado: itemId });
});

export default routerProduct;
