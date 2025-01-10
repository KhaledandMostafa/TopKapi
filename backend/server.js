import express from "express";
import pkg from "pg";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import jwt from "jsonwebtoken";
const { Pool } = pkg;
import path from "path";
import { fileURLToPath } from "url";
import { console } from "inspector";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = yaml.load(path.join(__dirname, "swagger.yaml"));

// Set up Swagger UI
const pool = new Pool({
  user: "postgres", // Replace with your PostgreSQL username
  host: "localhost",
  database: "top_kabi_db", // Replace with your database name
  password: "password", // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

const port = process.env.PORT;
const app = express();
app.use(bodyParser.json());

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const JWT_SECRET = process.env.JWT_SECRET;

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const ID = req.params.id;
    const result = await pool.query(`SELECT * FROM products WHERE ID=${ID}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT id, email, password, username FROM users WHERE email = $1 AND password = $2 ",
      [email, password]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const userId = user.id;
      const token = jwt.sign(
        { email: user.email, username: user.username },
        JWT_SECRET
      );
      res.status(200).json({
        msg: "Login successful",
        token,
        userId,
        userdata: [user.username, user.email],
      });
    } else {
      res.status(401).json({ msg: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "database query failed" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const token = jwt.sign({ email, username }, JWT_SECRET);
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING *",
      [username, email, password]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const userId = user.id;
      res.status(201).json({
        msg: "user created successfully",
        token,
        userId,
        userdata: [username, email],
      });
    } else {
      res.status(500).json({ msg: "failed to create user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "database query failed" });
  }
});

const getOrCreateCart = async (userId) => {
  const { rows: cartRows } = await pool.query(
    "SELECT * FROM cart WHERE user_id = $1",
    [userId]
  );

  if (cartRows.length === 0) {
    const { rows: newCartRows } = await pool.query(
      "INSERT INTO cart (user_id) VALUES ($1) RETURNING *",
      [userId]
    );
    return newCartRows[0];
  }
  return cartRows[0];
};

// Add to Cart
app.post("/cart", async (req, res) => {
  const { user_id: userId, product_id: productId, quantity } = req.body;

  try {
    // Validate product exists
    const { rows: productRows } = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    if (productRows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    // Get or create user's cart
    const cart = await getOrCreateCart(userId);

    // Check if the item already exists in the cart
    const { rows: existingItemRows } = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cart.id, productId]
    );

    if (existingItemRows.length > 0) {
      // Update quantity if product already exists in cart
      const { rows: updatedItemRows } = await pool.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *",
        [quantity || 1, existingItemRows[0].id]
      );
      const { rows: updatedCartItems } = await pool.query(
        `SELECT 
          ci.id AS cart_item_id, 
          p.id AS product_id, 
          p.title, 
          p.price, 
          ci.quantity, 
          p.image_cover
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = $1`,
        [cart.id]
      );
      return res
        .status(200)
        .json({ msg: "Cart item updated", cart_items: updatedCartItems });
    }

    // Add new item to the cart
    const { rows: newItemRows } = await pool.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [cart.id, productId, quantity || 1]
    );
    const { rows: updatedCartItems } = await pool.query(
      `SELECT 
        ci.id AS cart_item_id, 
        p.id AS product_id, 
        p.title, 
        p.price, 
        ci.quantity, 
        p.image_cover
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1`,
      [cart.id]
    );
    res
      .status(201)
      .json({ msg: "Item added to cart", cart_items: updatedCartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove from Cart
app.delete("/cart", async (req, res) => {
  const { productId, userId } = req.body;

  try {
    const cartResult = await pool.query(
      `SELECT id AS cart_id FROM cart WHERE user_id = $1`,
      [userId]
    );
    // التحقق من وجود cart
    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: "No cart found for this user" });
    }
    const cartId = cartResult.rows[0].cart_id;

    const { rows: deletedItemRows } = await pool.query(
      "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *",
      [cartId, productId]
    );
    if (deletedItemRows.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const { rows: remainingItems } = await pool.query(
      `SELECT 
      ci.id AS cart_item_id, 
      ci.cart_id, 
      ci.product_id, 
      p.title, 
      p.price, 
      ci.quantity, 
      p.image_cover
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = $1;
    `,
      [cartId]
    );

    res
      .status(200)
      .json({ msg: "Item removed from cart", cart_item: remainingItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// View Cart
app.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user's cart
    const { rows: cartRows } = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1",
      [userId]
    );
    if (cartRows.length === 0)
      return res.status(404).json({ error: "Cart not found" });

    // Fetch all items in the cart
    const { rows: itemsRows } = await pool.query(
      `SELECT 
        ci.id AS cart_item_id, 
        p.id AS product_id, 
        p.title, 
        p.price, 
        ci.quantity, 
        p.image_cover
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartRows[0].id]
    );

    res.status(200).json({ cart: itemsRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update quantatiy
app.patch("/cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cartResult = await pool.query(
      `SELECT id AS cart_id FROM cart WHERE user_id = $1`,
      [userId]
    );
    const cartId = cartResult.rows[0].cart_id;

    const result = await pool.query(
      `UPDATE cart_items
        SET quantity = $1
        WHERE cart_id = $2 AND product_id = $3`,
      [quantity, cartId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "Cart id or product id is wrong" });
    }

    const cart_items = await pool.query(
      `SELECT 
        ci.id AS cart_item_id, 
        p.id AS product_id, 
        p.title, 
        p.price, 
        ci.quantity, 
        p.image_cover
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    res.status(200).json({
      msg: "Quantity updated successfully",
      cart_items: cart_items.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => console.log(`now we are listening on port ${port}`));
