import categoryModel from "../models/categories.model.js";

export const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const category = new categoryModel({ name, description, image });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const category = await categoryModel.findById(req.params.id);
        category.name = name || category.name;
        category.description = description || category.description;
        category.image = image || category.image;
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await categoryModel.deleteOne({ _id: req.params.id });
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
