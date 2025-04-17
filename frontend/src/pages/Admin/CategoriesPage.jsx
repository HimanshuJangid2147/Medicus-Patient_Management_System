import React, { useEffect, useState } from 'react';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import Modal from '../../components/admin/Model.jsx';
import ResponsiveList from '../../components/admin/ResponsiveList';
import {
    MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PlusIcon, PencilIcon, TrashIcon, CheckIcon,
    ArrowPathIcon, TagIcon, XCircleIcon
} from '@heroicons/react/24/outline';

const CategoriesPage = () => {
    const {
        categories,
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
    } = useCategoriesStore();
    const [categorySearchQuery, setCategorySearchQuery] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '', isActive: true });

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    useEffect(() => {
        const filtered = categories.filter(
            (category) =>
                category.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
                (category.description && category.description.toLowerCase().includes(categorySearchQuery.toLowerCase()))
        );
        setFilteredCategories(filtered);
    }, [categories, categorySearchQuery]);

    useEffect(() => {
        if (!isCategoryModalOpen) {
            setCategoryFormData({ name: '', description: '', isActive: true });
            setSelectedCategory(null);
        }
    }, [isCategoryModalOpen]);

    const handleCategoryChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCategoryFormData({ ...categoryFormData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleOpenCreateCategoryModal = () => {
        setSelectedCategory(null);
        setCategoryFormData({ name: '', description: '', isActive: true });
        setIsCategoryModalOpen(true);
    };

    const handleOpenEditCategoryModal = (category) => {
        setSelectedCategory(category);
        setCategoryFormData({
            name: category.name,
            description: category.description || '',
            isActive: category.isActive !== false,
        });
        setIsCategoryModalOpen(true);
    };

    const handleOpenDeleteCategoryModal = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory._id, categoryFormData);
            } else {
                await createCategory(categoryFormData);
            }
            setIsCategoryModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            if (selectedCategory) {
                await deleteCategory(selectedCategory._id);
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderCategoryCard = (category) => (
        <div key={category._id} className="bg-white rounded-lg p-5 mb-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-100 text-teal-700 font-semibold rounded-full mr-3">
                        {category.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        <div
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                category.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {category.isActive !== false ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                </div>
            </div>
            {category.description && <p className="text-gray-600 text-sm mt-2 mb-4">{category.description}</p>}
            <div className="flex justify-end space-x-2 mt-3">
                <button
                    onClick={() => handleOpenEditCategoryModal(category)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                >
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => handleOpenDeleteCategoryModal(category)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );

    const renderCategoryRow = (category) => (
        <tr key={category._id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-semibold">
                        {category.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{category.description || '—'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
        <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                category.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
        >
          {category.isActive !== false ? 'Active' : 'Inactive'}
        </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleOpenEditCategoryModal(category)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleOpenDeleteCategoryModal(category)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <Modal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                title={selectedCategory ? 'Edit Category' : 'Create New Category'}
            >
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={categoryFormData.name}
                            onChange={handleCategoryChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter category name"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={categoryFormData.description}
                            onChange={handleCategoryChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter category description (optional)"
                        ></textarea>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={categoryFormData.isActive}
                            onChange={handleCategoryChange}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                            Active
                        </label>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsCategoryModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md flex items-center"
                        >
                            {(isCreating || isUpdating) ? (
                                <>
                                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                                    {selectedCategory ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                    {selectedCategory ? 'Update Category' : 'Create Category'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Category">
                <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                        <XCircleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Delete Category</h3>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteCategory}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md flex items-center"
                    >
                        {isDeleting ? (
                            <>
                                <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </Modal>
            <section className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Categories Overview</h2>
                <p className="text-gray-600 mt-1">Manage all categories here.</p>
            </section>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="bg-teal-100 p-3 rounded-lg mr-4">
                            <TagIcon className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">{categories.length}</h3>
                            <p className="text-gray-600 text-sm">Total Categories</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg mr-4">
                            <CheckIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {categories.filter((cat) => cat.isActive !== false).length}
                            </h3>
                            <p className="text-gray-600 text-sm">Active Categories</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                        <div className="bg-gray-100 p-3 rounded-lg mr-4">
                            <XCircleIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {categories.filter((cat) => cat.isActive === false).length}
                            </h3>
                            <p className="text-gray-600 text-sm">Inactive Categories</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            value={categorySearchQuery}
                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200">
                            <AdjustmentsHorizontalIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleOpenCreateCategoryModal}
                            className="bg-teal-500 hover:bg-teal-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                        >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            New Category
                        </button>
                    </div>
                </div>
            </div>
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">All Categories</h2>
                    <button
                        onClick={() => getCategories()}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Refresh
                    </button>
                </div>
                <ResponsiveList
                    items={filteredCategories}
                    renderMobileCard={renderCategoryCard}
                    tableHeaders={['Name', 'Description', 'Status', 'Actions']}
                    renderTableRow={renderCategoryRow}
                    isLoading={isLoading}
                    emptyMessage={categorySearchQuery ? 'No categories match your search.' : 'No categories yet. Create your first one!'}
                    emptyAction={categorySearchQuery ? () => setCategorySearchQuery('') : handleOpenCreateCategoryModal}
                    emptyActionLabel={categorySearchQuery ? 'Clear search' : 'Create Category'}
                />
            </section>
        </>
    );
};

export default CategoriesPage;