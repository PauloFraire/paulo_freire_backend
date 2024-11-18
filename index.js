import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// import routes
<<<<<<< HEAD
import academyActivitiesRoutes from "./routes/academyActivitiesRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import customsizeRoutes from "./routes/customsizeRoutes.js";
import imageActivityRoutes from "./routes/imageActivityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
=======
import academyActivitiesRoutes from './routes/academyActivitiesRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import customsizeRoutes from './routes/customsizeRoutes.js';
import imageActivityRoutes from './routes/imageActivityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
>>>>>>> c180c98a7ea5ab8036d60e31a9872a9d21f7dd1d
import validateTokenRoutes from "./routes/validateTokenRoutes.js"; // de main
import politicasRoutes from "./routes/politicasRoutes.js"; // de marvin
import deslindeRoutes from "./routes/deslindeRoutes.js"; // de marvin
import terminosRoutes from "./routes/terminosRoutes.js"; // de marvin
<<<<<<< HEAD
import socialRoutes from "./routes/socialLinkRoutes.js";
import sloganRoutes from "./routes/sloganRoutes.js";
import logoRoutes from "./routes/logoRoutes.js";
import headerTitleRoutes from "./routes/headerTitleRoutes.js";
=======

>>>>>>> c180c98a7ea5ab8036d60e31a9872a9d21f7dd1d
const app = express();
dotenv.config();
// whitelist frontend url

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

<<<<<<< HEAD
//Routes
app.use("/api", academyActivitiesRoutes);
app.use("/api", blogRoutes);
app.use("/api", customsizeRoutes);
app.use("/api", imageActivityRoutes);
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", validateTokenRoutes); // de main
//--------------------para la parte de aceca de----------------------------------------------------------------
app.use("/api", politicasRoutes); // de marvin
app.use("/api", deslindeRoutes); // de marvin
app.use("/api", terminosRoutes); // de marvin
//--------------------para la parte de aceca de----------------------------------------------------------------
//--------------------------------------------Para slogan, logo y tituto de la pagina--------------------------
app.use("/api", sloganRoutes);
app.use("/api", logoRoutes);
app.use("/api", headerTitleRoutes);
//--------------------------------------------Para slogan, logo y tituto de la pagina--------------------------
=======
// Routes
app.use('/api', academyActivitiesRoutes);
app.use('/api', blogRoutes);
app.use('/api', customsizeRoutes);
app.use('/api', imageActivityRoutes);
app.use('/api', userRoutes);
app.use('/api', contactRoutes);
app.use('/api', validateTokenRoutes); // de main
app.use("/api", politicasRoutes); // de marvin
app.use("/api", deslindeRoutes); // de marvin
app.use("/api", terminosRoutes); // de marvin
>>>>>>> c180c98a7ea5ab8036d60e31a9872a9d21f7dd1d

const PORT = 8000;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
