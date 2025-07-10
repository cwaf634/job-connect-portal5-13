import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Building, QrCode, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  onPaymentSuccess: () => void;
}

const PaymentMethodModal = ({ isOpen, onClose, plan, onPaymentSuccess }: PaymentMethodModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    bankAccount: '',
    ifscCode: ''
  });
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
    { id: 'upi', name: 'UPI Payment', icon: QrCode, description: 'PhonePe, GooglePay, Paytm' },
    { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'All major banks' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Payment Successful!",
      description: `You have successfully subscribed to ${plan.name}. Your subscription is now active.`,
    });

    onPaymentSuccess();
    setIsProcessing(false);
    onClose();
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Complete Payment</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Plan Summary */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
          <h3 className="font-semibold text-blue-900">{plan.name}</h3>
          <p className="text-2xl font-bold text-blue-700">₹{plan.price}</p>
          <p className="text-sm text-blue-600">Billed {plan.period}</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          {/* Payment Method Selection */}
          <div>
            <Label className="text-base font-medium">Choose Payment Method</Label>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="mt-2">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <method.icon className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <Label htmlFor={method.id} className="font-medium cursor-pointer">
                      {method.name}
                    </Label>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Payment Form Fields */}
          {selectedMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@upi"
                value={formData.upiId}
                onChange={(e) => handleInputChange('upiId', e.target.value)}
                required
              />
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="bankAccount">Account Number</Label>
                <Input
                  id="bankAccount"
                  placeholder="Account Number"
                  value={formData.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="SBIN0000123"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-800">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Pay ₹${plan.price}`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodModal;