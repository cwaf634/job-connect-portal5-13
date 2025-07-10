
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionPlans } from '@/contexts/SubscriptionPlansContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { localStorageUtils, STORAGE_KEYS, DataManager } from '@/data/dummyData';
import PaymentMethodModal from './PaymentMethodModal';

const SubscriptionSection = () => {
  const { plans } = useSubscriptionPlans();
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Get plans from DataManager to ensure we have the latest admin-created plans
  const adminPlans = DataManager.getSubscriptionPlans();

  const handleSubscribe = (planId: string) => {
    const plan = [...plans, ...adminPlans].find(p => p.id === planId);
    if (!plan || !user) return;

    if (plan.price === '₹0' || plan.price === '0' || (typeof plan.price === 'number' && plan.price === 0)) {
      // Free plan - immediate activation
      const userSubscriptions = localStorageUtils.get(STORAGE_KEYS.USER_SUBSCRIPTIONS, {});
      userSubscriptions[user.id] = {
        planId: plan.id,
        planName: plan.name,
        subscribedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      localStorageUtils.set(STORAGE_KEYS.USER_SUBSCRIPTIONS, userSubscriptions);
      updateProfile({ subscriptionTier: plan.name });

      toast({
        title: "Subscription Successful!",
        description: `You have successfully subscribed to ${plan.name} plan.`,
      });
    } else {
      // Paid plan - show payment modal
      setSelectedPlan(plan);
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = () => {
    if (!selectedPlan || !user) return;

    const userSubscriptions = localStorageUtils.get(STORAGE_KEYS.USER_SUBSCRIPTIONS, {});
    userSubscriptions[user.id] = {
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      subscribedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    localStorageUtils.set(STORAGE_KEYS.USER_SUBSCRIPTIONS, userSubscriptions);
    updateProfile({ subscriptionTier: selectedPlan.name });

    setSelectedPlan(null);
  };

  const getIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic': return <Zap className="w-6 h-6" />;
      case 'premium': return <Star className="w-6 h-6" />;
      case 'enterprise': return <Crown className="w-6 h-6" />;
      default: return <Check className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">Unlock premium features to accelerate your career</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...plans, ...adminPlans].map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative hover:shadow-lg transition-all duration-300 border-2 ${
              plan.isPopular 
                ? 'border-blue-500 scale-105 shadow-lg' 
                : 'border-gray-200 hover:border-blue-300'
            } ${plan.bgColor} ${plan.borderColor}`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 mx-auto rounded-full ${plan.bgColor} ${plan.borderColor} border-2 flex items-center justify-center mb-4`}>
                <div className={plan.iconColor}>
                  {getIcon(plan.name)}
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
              
              <div className="text-center">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full mt-6 ${
                  plan.isPopular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } ${
                  user?.subscriptionTier === plan.name 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : ''
                }`}
                disabled={user?.subscriptionTier === plan.name}
              >
                {user?.subscriptionTier === plan.name ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Current Plan
                  </>
                ) : plan.price === '₹0' ? (
                  'Get Started Free'
                ) : (
                  `Subscribe to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Subscription Info */}
      {user?.subscriptionTier && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Current Subscription: {user.subscriptionTier}
                </h3>
                <p className="text-green-700 text-sm">
                  You're enjoying all the benefits of your {user.subscriptionTier} plan
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Comparison */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-center">Why Upgrade?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">More Mock Tests</h4>
              <p className="text-sm text-gray-600">Access unlimited practice tests to improve your scores</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Priority Support</h4>
              <p className="text-sm text-gray-600">Get faster responses and dedicated assistance</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Direct Contact</h4>
              <p className="text-sm text-gray-600">Connect directly with employers and shopkeepers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSection;
