import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, createInventoryItem, updateInventoryItem } from '../../store/slices/inventorySlice';
import { Package, Plus, Edit3, AlertTriangle, Save, X } from 'lucide-react';
import Loader, { ButtonLoader } from '../../components/Loader';
import toast from 'react-hot-toast';

const AdminInventory = () => {
  const dispatch = useDispatch();
  const { items: inventory, isLoading } = useSelector((state) => state.inventory);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'base',
    quantity: 0,
    threshold: 10,
    price: 0,
    description: '',
  });

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const categories = ['base', 'sauce', 'cheese', 'veggie', 'meat'];
  const lowStockItems = inventory.filter(item => item.quantity < (item.threshold || 10));

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'base',
      quantity: 0,
      threshold: 10,
      price: 0,
      description: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        const result = await dispatch(updateInventoryItem({ 
          id: editingItem._id, 
          itemData: formData 
        }));
        if (updateInventoryItem.fulfilled.match(result)) {
          toast.success('Item updated successfully');
          setEditingItem(null);
        }
      } else {
        const result = await dispatch(createInventoryItem(formData));
        if (createInventoryItem.fulfilled.match(result)) {
          toast.success('Item added successfully');
          setShowAddModal(false);
        }
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      threshold: item.threshold || 10,
      price: item.price || 0,
      description: item.description || '',
    });
    setEditingItem(item);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowAddModal(false);
    resetForm();
  };

  if (isLoading) {
    return <Loader text="Loading inventory..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage pizza ingredients and supplies</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-red-800">Low Stock Alerts ({lowStockItems.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <span key={item._id} className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {item.name} ({item.quantity} left)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500">{item.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        item.quantity < (item.threshold || 10) ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {item.quantity}
                      </span>
                      {item.quantity < (item.threshold || 10) && (
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Threshold: {item.threshold || 10}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{item.price || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-700 mr-4"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Edit Item' : 'Add New Item'}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Threshold
                    </label>
                    <input
                      type="number"
                      value={formData.threshold}
                      onChange={(e) => setFormData({...formData, threshold: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                </div>

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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
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
                        {editingItem ? 'Update' : 'Add'} Item
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

export default AdminInventory;