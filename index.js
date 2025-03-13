import express from "express";
import dotenv from "dotenv";
import cors from "cors";
/* import fileUpload from "express-fileupload"; // <-- Importa express-fileupload
 */import connectDB from "./config/db.js";

import academyActivitiesRoutes from "./routes/academyActivitiesRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import customsizeRoutes from "./routes/customsizeRoutes.js";
import imageActivityRoutes from "./routes/imageActivityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import validateTokenRoutes from "./routes/validateTokenRoutes.js";
import politicasRoutes from "./routes/politicasRoutes.js";
import deslindeRoutes from "./routes/deslindeRoutes.js";
import terminosRoutes from "./routes/terminosRoutes.js";
import socialRoutes from "./routes/socialLinkRoutes.js";
import sloganRoutes from "./routes/sloganRoutes.js";
import logoRoutes from "./routes/logoRoutes.js";
import headerTitleRoutes from "./routes/headerTitleRoutes.js";
import contextoContemporaneoRoutes from "./routes/contextoContemporaneoRoutes.js";
import ofertaEducativaRoutes from "./routes/ofertaEducativaRoutes.js";
import pdfsCCRoutes from "./routes/pdfsCCRoutes.js";
import becaRoutes from "./routes/becaRoutes.js"; // Importar rutas de becas

const app = express();
dotenv.config();

connectDB();

/* // Agrega el middleware de express-fileupload ANTES de los demás middlewares y rutas
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
); */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = "http://localhost:5173";

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
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
app.use("/api", validateTokenRoutes);
app.use("/api", politicasRoutes);
app.use("/api", deslindeRoutes);
app.use("/api", terminosRoutes);
app.use("/api", socialRoutes);
app.use("/api", sloganRoutes);
app.use("/api", logoRoutes);
app.use("/api", headerTitleRoutes);
app.use("/api", contextoContemporaneoRoutes);
app.use("/api", pdfsCCRoutes);
app.use("/api", ofertaEducativaRoutes);
app.use("/api", becaRoutes);

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
