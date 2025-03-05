import ContextoContemporaneo from "../models/ContextoContemporaneo.js";

const obtenerContextos = async (req, res) => {
    try {
        const contextos = await ContextoContemporaneo.find();
        res.json(contextos);
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
};

const nuevoContexto = async (req, res) => {
    try {
        const contexto = new ContextoContemporaneo(req.body);
        const contextoAlmacenado = await contexto.save();
        res.json(contextoAlmacenado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const obtenerContexto = async (req, res) => {
    try {
        const contexto = await ContextoContemporaneo.findById(req.params.id);
        if (!contexto) {
            return res.status(404).json({ msg: "No encontrado" });
        }
        res.json(contexto);
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
};

const actualizarContexto = async (req, res) => {
    try {
        const contexto = await ContextoContemporaneo.findById(req.params.id);
        if (!contexto) {
            return res.status(404).json({ msg: "No encontrado" });
        }

        contexto.title = req.body.title || contexto.title;
        contexto.article = req.body.article || contexto.article;
        contexto.mainSection = req.body.mainSection || contexto.mainSection;
        contexto.author = req.body.author || contexto.author;
        contexto.articleDescription = req.body.articleDescription || contexto.articleDescription;

        contexto.mainLinkAutor = req.body.mainLinkAutor || contexto.mainLinkAutor;
        contexto.mainLink = req.body.mainLink || contexto.mainLink;
        contexto.secondaryLinks = req.body.secondaryLinks || contexto.secondaryLinks;
        contexto.pdfs = req.body.pdfs || contexto.pdfs;

        const contextoActualizado = await contexto.save();
        res.json(contextoActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const eliminarContexto = async (req, res) => {
    try {
        const contexto = await ContextoContemporaneo.findById(req.params.id);
        if (!contexto) {
            return res.status(404).json({ msg: "No encontrado" });
        }
        await contexto.deleteOne();
        res.json({ msg: "Contexto Eliminado" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
};

export {
    obtenerContextos,
    nuevoContexto,
    obtenerContexto,
    actualizarContexto,
    eliminarContexto
};