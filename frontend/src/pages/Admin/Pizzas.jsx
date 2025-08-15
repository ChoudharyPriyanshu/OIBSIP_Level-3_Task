import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPizzas, createPizza, updatePizza, deletePizza } from '../../store/slices/pizzaSlice';
import { Pizza, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import Loader, { ButtonLoader } from '../../components/Loader';
import toast from 'react-hot-toast';

const AdminPizzas = () => {
  const dispatch = useDispatch();
  const { list: pizzas, isLoading } = useSelector((state) => state.pizzas);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPizza, setEditingPizza] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'vegetarian',
    image: '',
    ingredients: '',
  });

  useEffect(() => {
    dispatch(fetchPizzas());
  }, [dispatch]);

  const categories = ['vegetarian', 'non-vegetarian', 'vegan', 'specialty'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'vegetarian',
      image: '',
      ingredients: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert ingredients string to array
    const processedData = {
      ...formData,
      ingredients: formData.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing)
    };
    
    try {
      if (editingPizza) {
        const result = await dispatch(updatePizza({ 
          id: editingPizza._id, 
          pizzaData: processedData 
        }));
        if (updatePizza.fulfilled.match(result)) {
          toast.success('Pizza updated successfully');
          setEditingPizza(null);
        }
      } else {
        const result = await dispatch(createPizza(processedData));
        if (createPizza.fulfilled.match(result)) {
          toast.success('Pizza added successfully');
          setShowAddModal(false);
        }
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save pizza');
    }
  };

  const handleEdit = (pizza) => {
    setFormData({
      name: pizza.name,
      description: pizza.description,
      price: pizza.price,
      category: pizza.category,
      image: pizza.image || '',
      ingredients: pizza.ingredients ? pizza.ingredients.join(', ') : '',
    });
    setEditingPizza(pizza);
  };

  const handleDelete = async (pizzaId, pizzaName) => {
    if (deleteConfirm !== pizzaId) {
      setDeleteConfirm(pizzaId);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      const result = await dispatch(deletePizza(pizzaId));
      if (deletePizza.fulfilled.match(result)) {
        toast.success(`Pizza ${pizzaName} deleted successfully`);
        setDeleteConfirm(null);
      }
    } catch (error) {
      toast.error('Failed to delete pizza');
    }
  };

  const handleCancel = () => {
    setEditingPizza(null);
    setShowAddModal(false);
    resetForm();
  };

  if (isLoading) {
    return <Loader text="Loading pizzas..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pizza Management</h1>
          <p className="text-gray-600">Manage pizza menu items</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pizza
        </button>
      </div>

      {pizzas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Pizza className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Pizzas Found</h2>
          <p className="text-gray-600 mb-4">Start building your menu by adding your first pizza.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Add Your First Pizza
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((pizza) => (
            <div key={pizza._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={pizza.image || 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'}
                  alt={pizza.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{pizza.name}</h3>
                  <span className="text-lg font-bold text-blue-600">₹{pizza.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pizza.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                    {pizza.category}
                  </span>
                </div>
                
                {pizza.ingredients && pizza.ingredients.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {pizza.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {ingredient}
                        </span>
                      ))}
                      {pizza.ingredients.length > 3 && (
                        <span className="text-gray-500 text-xs">+{pizza.ingredients.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pizza)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pizza._id, pizza.name)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                      deleteConfirm === pizza._id
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-red-100 hover:bg-red-200 text-red-700'
                    }`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deleteConfirm === pizza._id ? 'Confirm' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingPizza) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingPizza ? 'Edit Pizza' : 'Add New Pizza'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category} className="capitalize">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/pizza-image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredients (Optional)
                  </label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="Cheese, Tomato Sauce, Pepperoni, etc. (comma separated)"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? <ButtonLoader /> : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingPizza ? 'Update' : 'Add'} Pizza
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPizzas;