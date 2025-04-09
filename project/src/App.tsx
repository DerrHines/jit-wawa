import React, { useState, FormEvent, ChangeEvent } from 'react';

interface OrderSummary {
  waterType: string;
  waterQty: number;
  dispenserType: string;
  dispenserQty: number;
  total: number;
}

function App() {
  const [showBusinessName, setShowBusinessName] = useState(false);
  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    waterType: '',
    waterQty: 0,
    dispenserType: '',
    dispenserQty: 0,
    total: 0
  });

  const prices = {
    "Purified Water": 7.49,
    "Spring Water": 8.49,
    "Alkaline Water": 13.99,
    "HotCold Dispenser": 5.99,
    "Coffee Dispenser": 11.99
  };

  const updateOrderSummary = (
    waterType: string,
    waterQty: number,
    dispenserType: string,
    dispenserQty: number
  ) => {
    const waterTotal = waterQty * (waterType ? prices[waterType as keyof typeof prices] : 0);
    const dispenserTotal = dispenserQty * (dispenserType.includes("Dispenser") ? prices[dispenserType as keyof typeof prices] : 0);
    const deliveryFee = 13.99;
    const total = waterTotal + dispenserTotal + deliveryFee;

    setOrderSummary({
      waterType,
      waterQty,
      dispenserType,
      dispenserQty,
      total
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch('https://formspree.io/f/xeoalnal', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setShowConfirmation(true);
        window.scrollTo(0, document.body.scrollHeight);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateCostcoNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const costcoNumber = e.target.value.replace(/\D/g, "");
    if (costcoNumber.length !== 12) {
      e.target.setCustomValidity("Costco Membership # must be 12 digits.");
    } else {
      e.target.setCustomValidity("");
    }
  };

  return (
    <div className="min-h-screen bg-[#E6F0FA] text-[#003087] p-5">
      <header className="py-4 text-center">
        <img src="/jit.png" alt="Primo Water" className="w-[150px] mx-auto" />
      </header>
      
      <h1 className="text-3xl font-bold text-center mb-3">Primo Water Delivery</h1>
      
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg border-2 border-[#003087] shadow-lg">
        <p className="text-lg text-[#005566] mb-6">In Partnership with Costco</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="costco" className="block mb-2">
                Costco Membership Number (Required for Discount):
              </label>
              <input
                type="text"
                id="costco"
                name="costco"
                onChange={validateCostcoNumber}
                placeholder="Enter 12-digit Costco Membership #"
                required
                className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block mb-2">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  required
                  className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block mb-2">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dayPhone" className="block mb-2">Daytime Phone:</label>
                <input
                  type="tel"
                  id="dayPhone"
                  name="dayPhone"
                  placeholder="123-456-7890"
                  required
                  className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="nightPhone" className="block mb-2">Evening Phone (Optional):</label>
                <input
                  type="tel"
                  id="nightPhone"
                  name="nightPhone"
                  placeholder="123-456-7890"
                  className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block mb-2">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                required
                className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="commercial" className="block mb-2">Account Type:</label>
              <select
                id="commercial"
                name="commercial"
                onChange={(e) => setShowBusinessName(e.target.value === "Yes")}
                className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
              >
                <option value="No">Residential</option>
                <option value="Yes">Commercial</option>
              </select>
            </div>

            {showBusinessName && (
              <div>
                <label htmlFor="businessName" className="block mb-2">Business Name:</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  placeholder="Business Name"
                  className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                />
              </div>
            )}

            <div className="space-y-4">
              <label htmlFor="address" className="block mb-2">Delivery Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Street Address"
                required
                className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  required
                  className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                />
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="State"
                  required
                  className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                />
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  placeholder="Zip Code"
                  required
                  className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="billingAddress" className="block mb-2">Use a Different Billing Address?</label>
              <select
                id="billingAddress"
                name="billingAddress"
                onChange={(e) => setShowBillingAddress(e.target.value === "Yes")}
                className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {showBillingAddress && (
              <div className="space-y-4">
                <label htmlFor="billing" className="block mb-2">Billing Address:</label>
                <input
                  type="text"
                  id="billing"
                  name="billing"
                  placeholder="Street Address"
                  className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    id="billingCity"
                    name="billingCity"
                    placeholder="City"
                    className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                  />
                  <input
                    type="text"
                    id="billingState"
                    name="billingState"
                    placeholder="State"
                    className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                  />
                  <input
                    type="text"
                    id="billingZip"
                    name="billingZip"
                    placeholder="Zip Code"
                    className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-[#FFD700] rounded-lg p-4 bg-[#F7FAFF]">
                <h3 className="text-xl font-semibold mb-4">Water Order (Required)</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="waterType" className="block mb-2">Water Type:</label>
                    <select
                      id="waterType"
                      name="waterType"
                      required
                      onChange={(e) => updateOrderSummary(
                        e.target.value,
                        orderSummary.waterQty,
                        orderSummary.dispenserType,
                        orderSummary.dispenserQty
                      )}
                      className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                    >
                      <option value="" disabled selected>Select Water Type</option>
                      <option value="Purified Water">Purified Water - $7.49/5 Gal</option>
                      <option value="Spring Water">Spring Water - $8.49/5 Gal</option>
                      <option value="Alkaline Water">Alkaline Water - $13.99/3 Gal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="waterQuantity" className="block mb-2">Quantity (Min. 2):</label>
                    <input
                      type="number"
                      id="waterQuantity"
                      name="waterQuantity"
                      min="2"
                      placeholder="2"
                      required
                      onChange={(e) => updateOrderSummary(
                        orderSummary.waterType,
                        parseInt(e.target.value) || 0,
                        orderSummary.dispenserType,
                        orderSummary.dispenserQty
                      )}
                      className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-[#FFD700] rounded-lg p-4 bg-[#F7FAFF]">
                <h3 className="text-xl font-semibold mb-4">Dispenser Selection</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="dispenserType" className="block mb-2">Dispenser Type:</label>
                    <select
                      id="dispenserType"
                      name="dispenserType"
                      required
                      onChange={(e) => updateOrderSummary(
                        orderSummary.waterType,
                        orderSummary.waterQty,
                        e.target.value,
                        orderSummary.dispenserQty
                      )}
                      className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                    >
                      <option value="" disabled selected>Select Dispenser Type</option>
                      <option value="None">None - Water Only</option>
                      <option value="HotCold Dispenser">Bottom-Loading Hot & Cold Dispenser - $5.99/mo (3 mo Free)</option>
                      <option value="Coffee Dispenser">Bottom-Loading Coffee Pod Brewer Dispenser - $11.99/mo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dispenserQuantity" className="block mb-2">Quantity:</label>
                    <input
                      type="number"
                      id="dispenserQuantity"
                      name="dispenserQuantity"
                      min="0"
                      placeholder="0"
                      value={orderSummary.dispenserQty}
                      onChange={(e) => updateOrderSummary(
                        orderSummary.waterType,
                        orderSummary.waterQty,
                        orderSummary.dispenserType,
                        parseInt(e.target.value) || 0
                      )}
                      className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-dashed border-[#003087] p-4 bg-[#F7FAFF] space-y-2">
              <h3 className="text-xl font-semibold">Order Summary</h3>
              <p>Water: {orderSummary.waterQty} x {orderSummary.waterType || "Not Selected"}</p>
              <p>Dispenser: {orderSummary.dispenserQty} x {orderSummary.dispenserType || "None"}</p>
              <p className="font-bold">Total (incl. $13.99 delivery): ${orderSummary.total.toFixed(2)}</p>
            </div>

            <div>
              <label htmlFor="delivery" className="block mb-2">Delivery Frequency:</label>
              <select
                id="delivery"
                name="delivery"
                required
                className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none"
              >
                <option value="2 weeks">Every 2 Weeks</option>
                <option value="4 weeks">Every 4 Weeks</option>
                <option value="8 weeks">Every 8 Weeks</option>
              </select>
            </div>

            <p className="italic text-gray-700">
              We'll deliver your water as often as you need and pickup your empty bottles. 
              Edit your order at anytime on our app.
            </p>

            <div>
              <label htmlFor="deliveryNotes" className="block mb-2">Delivery Instructions:</label>
              <textarea
                id="deliveryNotes"
                name="deliveryNotes"
                placeholder="E.g., 'Leave at front door' or 'Contact to pause delivery later'"
                className="w-full p-2 border border-[#A3BFFA] rounded focus:border-[#003087] focus:outline-none h-24"
              ></textarea>
            </div>

            <p className="text-sm text-gray-600">
              First order includes a <span className="text-[#003087] font-bold">$5 deposit</span> per bottle, 
              refunded after cancellation. Delivery fee: <span className="text-[#003087] font-bold">$13.99</span> per delivery. 
              No contract—pause or cancel anytime.
            </p>

            {isLoading && (
              <div className="w-8 h-8 border-4 border-[#f3f3f3] border-t-4 border-t-[#FFD700] rounded-full animate-spin mx-auto"></div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#003087] text-[#FFD700] font-bold py-3 px-4 rounded border border-[#FFD700] hover:bg-[#002366] transition-colors disabled:opacity-50"
            >
              Place Order
            </button>
          </div>
        </form>

        {showConfirmation && (
          <div className="mt-6 p-4 bg-[#E6F7E6] border-2 border-[#4CAF50] rounded text-[#003087] text-lg text-center">
            Your order has been successfully submitted (please check your email for further instruction)
          </div>
        )}
      </div>
    </div>
  );
}

export default App;