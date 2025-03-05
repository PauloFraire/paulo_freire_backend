import mongoose from 'mongoose';

const ContextoContemporaneoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    mainSection: {
        type: String,
        required: [true, 'La sección principal es obligatoria'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'El autor es obligatorio'],
        trim: true
    },
    article: {
        type: String,
        required: [true, 'El articulo es obligatorio'],
        trim: true
    },
    articleDescription: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },

    mainLinkAutor: {
        type: String,
        required: [true, 'El autor del enlace principal es obligatorio'],
        trim: true
    },
    mainLink: {
        type: String,
        required: [true, 'El enlace principal es obligatorio'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} no es una URL válida`
        }
    },
    secondaryLinks: [{
        name: {
            type: String,
            required: [true, 'El nombre del enlace es obligatorio'],
            trim: true
        },
        url: {
            type: String,
            required: [true, 'La URL del enlace es obligatoria'],
            trim: true,
            validate: {
                validator: function(v) {
                    return /^(http|https):\/\/[^ "]+$/.test(v);
                },
                message: props => `${props.value} no es una URL válida`
            }
        }
    }],
    pdfs: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

const ContextoContemporaneo = mongoose.model('ContextoContemporaneo', ContextoContemporaneoSchema);
export default ContextoContemporaneo;