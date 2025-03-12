import Blog from "../models/Blog.js";
import cloudinary from "../utils/cloudinary.js";

//getblogs

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

//get blosg isPublished

const getBlogsPublished = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true });
        res.status(200).json(blogs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


//get blog by id 
const getBlogById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            const error = new Error('Campos Requeridos');

            return res.status(400).json(error.message);
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            const error = new Error('Blog no encontrado');
            return res.status(404).json(error.message)
        }

        res.json(blog);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


//crear un blog
const createBlog = async (req, res) => {
    const { title, description, date } = req.body;
    let img = req.file;

    console.log(title, description, date);

    console.log(img);
    try {
        if (!title || !description || !date || !img) {
            const error = new Error('Por favor llene todos los campos');
            return res.status(400).json(error.message);
        }

        const result = await cloudinary.uploader.upload(img.path, {
            folder: "blogs",
            with: 1200,
            crop: "scale"
        });

        const newBlog = new Blog({
            title,
            description,
            date,
            img: result.url,
            public_id: result.public_id
        });

        await newBlog.save();

        res.json({ message: 'Blog Creado Correctamente' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }


}

//actualizar blog 

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, isPublished } = req.body;

    // console.log(title, description, date, isPublished);

    try {
        if (!title || !description || !date || !isPublished) {
            const error = new Error('Por favor llene todos los campos');
            return res.status(400).json(error.message);
        }

        //buscamos el blog
        const blog = await Blog.findById(id);

        if (!blog) {
            const error = new Error('Blog no encontrado');
            return res.status(404).json(error.message);
        }

        if (req.file) {
            const img = req.file;
            await cloudinary.uploader.destroy(blog.public_id);
            const result = await cloudinary.uploader.upload(img.path, {
                folder: 'blog',
                width: 1200,
                crop: "scale"
            });

            blog.img = result.url;
            blog.public_id = result.public_id;
        }

        blog.title = title;
        blog.description = description;
        blog.date = date;
        blog.isPublished = isPublished

        await blog.save();

        res.json(blog);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            const error = new Error('Campos Requeridos');
            return res.status(400).json(error.message);
        }

        const blogExist = await Blog.findById(id);

        if (!blogExist) {
            const error = new Error('Blog no encontrado');
            return res.status(404).json(error.message);
        }

        await cloudinary.uploader.destroy(blogExist.public_id);
        await Blog.findByIdAndDelete(id);

        res.json({ message: 'Blog Eliminado' });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export {
    getBlogs,
    getBlogsPublished,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
}