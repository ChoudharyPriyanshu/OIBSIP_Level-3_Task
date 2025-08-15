import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchByCategory } from '../../store/slices/inventorySlice';
import { setCurrentOrder } from '../../store/slices/orderSlice';
import { ChevronLeft, ChevronRight, Check, Plus, Minus } from 'lucide-react';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const CustomPizzaBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryItems, isLoading } = useSelector((state) => state.inventory);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({
    base: null,
    sauce: null,
    cheese: null,
    veggies: [],
    meat: [],
  });

  const steps = [
    { name: 'Base', category: 'base', required: true, multiSelect: false },
    { name: 'Sauce', category: 'sauce', required: true, multiSelect: false },
    { name: 'Cheese', category: 'cheese', required: true, multiSelect: false },
    { name: 'Veggies', category: 'veggie', required: false, multiSelect: true },
    { name: 'Meat', category: 'meat', required: false, multiSelect: true },
  ];

  useEffect(() => {
    // Fetch all category items
    steps.forEach(step => {
      dispatch(fetchByCategory(step.category));
    });
  }, [dispatch]);

  const handleSelection = (item, stepCategory, multiSelect) => {
    if (multiSelect) {
      const currentSelection = selectedOptions[stepCategory] || [];
      const isSelected = currentSelection.some(selected => selected._id === item._id);
      
      if (isSelected) {
        setSelectedOptions({
          ...selectedOptions,
          [stepCategory]: currentSelection.filter(selected => selected._id !== item._id)
        });
      } else {
        setSelectedOptions({
          ...selectedOptions,
          [stepCategory]: [...currentSelection, item]
        });
      }
    } else {
      setSelectedOptions({
        ...selectedOptions,
        [stepCategory]: item
      });
    }
  };

  const calculatePrice = () => {
    let total = 0;
    
    if (selectedOptions.base) total += selectedOptions.base.price || 0;
    if (selectedOptions.sauce) total += selectedOptions.sauce.price || 0;
    if (selectedOptions.cheese) total += selectedOptions.cheese.price || 0;
    
    selectedOptions.veggies.forEach(veggie => {
      total += veggie.price || 0;
    });
    
    selectedOptions.meat.forEach(meat => {
      total += meat.price || 0;
    });
    
    return total;
  };

  const canProceedToNext = () => {
    const currentStepConfig = steps[currentStep];
    const selection = selectedOptions[currentStepConfig.category];
    
    if (currentStepConfig.required) {
      if (currentStepConfig.multiSelect) {
        return selection && selection.length > 0;
      } else {
        return selection !== null;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleProceedToCheckout();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProceedToCheckout = () => {
    const orderData = {
      type: 'custom',
      customPizza: {
        base: selectedOptions.base,
        sauce: selectedOptions.sauce,
        cheese: selectedOptions.cheese,
        veggies: selectedOptions.veggies,
        meat: selectedOptions.meat,
      },
      totalPrice: calculatePrice(),
    };
    
    dispatch(setCurrentOrder(orderData));
    navigate('/checkout');
  };

  const renderStepContent = () => {
    const stepConfig = steps[currentStep];
    const items = categoryItems[stepConfig.category] || [];
    const currentSelection = selectedOptions[stepConfig.category];

    if (isLoading && items.length === 0) {
      return <Loader text={`Loading ${stepConfig.name.toLowerCase()} options...`} />;
    }

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Your {stepConfig.name}
            {stepConfig.required && <span className="text-red-500 ml-1">*</span>}
          </h2>
          {stepConfig.required ? (
            <p className="text-gray-600">Select exactly one option</p>
          ) : (
            <p className="text-gray-600">Select as many as you'd like (or skip)</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isSelected = stepConfig.multiSelect 
              ? currentSelection?.some(selected => selected._id === item._id)
              : currentSelection?._id === item._id;

            return (
              <div
                key={item._id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelection(item, stepConfig.category, stepConfig.multiSelect)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {isSelected && <Check className="h-5 w-5 text-blue-500" />}
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600">
                    {item.price ? `+₹${item.price}` : 'Free'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Stock: {item.quantity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {items.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600">No {stepConfig.name.toLowerCase()} options available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Build Your Pizza</h1>
            <div className="text-2xl font-bold text-blue-600">
              Total: ₹{calculatePrice()}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.name} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</div>
              <div className="font-semibold text-gray-900">Current Total: ₹{calculatePrice()}</div>
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Proceed to Checkout' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPizzaBuilder;