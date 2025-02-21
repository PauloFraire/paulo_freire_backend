import { isValidObjectId } from "mongoose";
import AcademyActivities from "../models/AcademyActivities.js";

const getAcademyActivities = async (req, res) => {
    try {
        const academyActivities = await AcademyActivities.find();
        res.json(academyActivities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAcademyActivityById = async (req, res) => {

    const { id } = req.params;

    if (!isValidObjectId(id)) {
        const error = new Error('Id no válido');
        return res.status(400).json(error.message);
    }

    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        const academyActivity = await AcademyActivities.findById(id);

        if (!academyActivity) {
            const error = new Error('Actividad no encontrada');
            return res.status(400).json(error.message);
        }

        res.json(academyActivity);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

//creat academy activity
const createAcademyActivity = async (req, res) => {

    const { title, description } = req.body;

    try {

        if (!title || !description) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const academyActivity = new AcademyActivities({
            title,
            description
        });

        await academyActivity.save();

        res.json(academyActivity);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


//update academy activity
const updateAcademyActivity = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        if (!title || !description) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const academyActivity = await AcademyActivities.findById(id);

        if (!academyActivity) {
            const error = new Error('Actividad no encontrada');
            return res.status(400).json(error.message);
        }

        academyActivity.title = title;
        academyActivity.description = description;

        await academyActivity.save();

        res.send('Actividad actualizada');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const deleteAcademyActivity = async (req, res) => {

    const { id } = req.params;
    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        const academyActivity = await AcademyActivities.findById(id);

        if (!academyActivity) {
            const error = new Error('Actividad no encontrada');
            return res.status(400).json(error.message);
        }

        await AcademyActivities.findByIdAndDelete(id);


        res.send('Actividad eliminada');


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export {
    getAcademyActivities,
    getAcademyActivityById,
    createAcademyActivity,
    updateAcademyActivity,
    deleteAcademyActivity
}