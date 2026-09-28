// ===== 1. Import the tools we need =====
import "dotenv/config";             // reads the .env file
import express from "express";      // the backend framework
import cors from "cors";            // lets your frontend (another port) talk to this server
import bcrypt from "bcryptjs";      // hashes passwords (never store real passwords!)
import jwt from "jsonwebtoken";     // creates login tokens
import mysql from "mysql2/promise"; // talks to the MySQL database

// ===== 2. Create the server =====
const app = express();
app.use(cors());
app.use(express.json()); // lets the server read JSON sent by the frontend

// ===== 3. Connect to the database =====
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ===== 4. Test route: is everything working? =====
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", database: "not connected" });
  }
});


// ===== 5. REGISTER: create a new account =====
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check the data
  if (!firstName || !lastName || !email || !password || password.length < 6) {
    return res.status(400).json({ error: "All fields are required, and the password needs 6+ characters" });
  }

  try {
    // Turn the password into a hash before saving it
    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
      [firstName.trim(), lastName.trim(), email.toLowerCase(), hash]
    );

    res.status(201).json({ message: "Account created", userId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "This email is already registered" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== 6. LOGIN: check email + password, give back a token =====
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    const user = rows[0];

    // Wrong email OR wrong password -> same message (safer)
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // The token proves "this user is logged in" for 7 days
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== 7. Guard: only logged-in users can pass =====
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ error: "Not logged in" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next(); // token is valid -> continue
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ===== 8. Protected route: "who am I?" =====
app.get("/api/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, email, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// ===== PRODUCTS: get all products =====
// ===== PRODUCTS: get all products (or only featured ones) =====
app.get("/api/products", async (req, res) => {
  try {
    let sql = "SELECT * FROM products";
    if (req.query.featured === "1") {
      sql += " WHERE featured = TRUE ORDER BY review_count DESC";
    } else {
      sql += " ORDER BY id";
    }
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== PRODUCTS: get one product by its id =====
app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== 9. Start the server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




// ===== ORDERS: place an order (logged-in users only) =====
app.post("/api/orders", requireAuth, async (req, res) => {
  const { fullName, address, city, phone, items } = req.body;

  // Check the data
  if (!fullName || !address || !city || !phone) {
    return res.status(400).json({ error: "Please fill in all the delivery fields" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty" });
  }

  // A transaction: either EVERYTHING is saved, or NOTHING is
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    let subtotal = 0;
    const lines = [];

    for (const item of items) {
      // Take the REAL price and stock from MySQL (never trust prices sent by the browser)
      // FOR UPDATE locks the row so two customers can't buy the last item at the same time
      const [rows] = await conn.query(
        "SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE",
        [item.productId]
      );
      const product = rows[0];
      const qty = Number(item.qty);

      if (!product) throw { status: 404, message: "A product in your cart no longer exists" };
      if (!Number.isInteger(qty) || qty < 1) throw { status: 400, message: "Invalid quantity" };
      if (qty > product.stock) {
        throw { status: 409, message: `Only ${product.stock} left for ${product.name}` };
      }

      subtotal += Number(product.price) * qty;
      lines.push({ productId: product.id, qty, price: product.price });
    }

    const shipping = subtotal >= 45 ? 0 : 5;
    const total = subtotal + shipping;

    // 1. Save the order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, full_name, address, city, phone, subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, fullName.trim(), address.trim(), city.trim(), phone.trim(), subtotal, shipping, total]
    );
    const orderId = orderResult.insertId;

    // 2. Save each product of the order + reduce the stock
    for (const line of lines) {
      await conn.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
        [orderId, line.productId, line.qty, line.price]
      );
      await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [line.qty, line.productId]);
    }

    await conn.commit(); // everything worked -> save for real
    res.status(201).json({ message: "Order placed", orderId, total });
  } catch (err) {
    await conn.rollback(); // something failed -> cancel everything
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release(); // give the connection back to the pool
  }
});

// ===== ORDERS: my orders (for the account page later) =====
app.get("/api/orders/mine", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});