import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// import routes
import academyActivitiesRoutes from './routes/academyActivitiesRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import customsizeRoutes from './routes/customsizeRoutes.js';
import imageActivityRoutes from './routes/imageActivityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import validateTokenRoutes from "./routes/validateTokenRoutes.js"; // de main
import politicasRoutes from "./routes/politicasRoutes.js"; // de marvin
import deslindeRoutes from "./routes/deslindeRoutes.js"; // de marvin
import terminosRoutes from "./routes/terminosRoutes.js"; // de marvin
import socialRoutes from "./routes/socialLinkRoutes.js"; // de marvin
import sloganRoutes from "./routes/sloganRoutes.js"; // de marvin
import logoRoutes from "./routes/logoRoutes.js"; // de marvin
import headerTitleRoutes from "./routes/headerTitleRoutes.js"; // de marvin

const app = express();
dotenv.config();

// Conectar a la base de datos
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = "http://localhost:5173";

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No está permitido
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Rutas
app.use("/api", academyActivitiesRoutes);
app.use("/api", blogRoutes);
app.use("/api", customsizeRoutes);
app.use("/api", imageActivityRoutes);
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", validateTokenRoutes); // de main
// -------------------- para la parte de acerca de --------------------------------
app.use("/api", politicasRoutes); // de marvin
app.use("/api", deslindeRoutes); // de marvin
app.use("/api", terminosRoutes); // de marvin
// -------------------- para la parte de acerca de --------------------------------
// -------------------- Para slogan, logo y título de la página ------------------
app.use("/api", socialRoutes); // de marvin
app.use("/api", sloganRoutes); // de marvin
app.use("/api", logoRoutes); // de marvin
app.use("/api", headerTitleRoutes); // de marvin
// -------------------- Para slogan, logo y título de la página ------------------

app.get("/api/error500", (req, res) => {
  res.status(500).send("Internal Server Error");
});

app.get("/api/error400", (req, res) => {
  res.status(400).send("Server Error");
});

const PORT = 8000;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
