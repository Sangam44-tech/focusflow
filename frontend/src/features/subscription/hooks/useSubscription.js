// frontend/src/features/subscription/hooks/useSubscription.js
import { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import toast from 'react-hot-toast';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const upgrade = async () => {
    setActionLoading(true);
    try {
      const { url } = await subscriptionService.createCheckoutSession();
      window.location.href = url;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start checkout');
    } finally {
      setActionLoading(false);
    }
  };

  const manageSubscription = async () => {
    setActionLoading(true);
    try {
      const { url } = await subscriptionService.createPortalSession();
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to open billing portal');
    } finally {
      setActionLoading(false);
    }
  };

  const cancel = async () => {
    setActionLoading(true);
    try {
      await subscriptionService.cancelSubscription();
      toast.success('Subscription will be canceled at the end of billing period');
      fetchSubscription();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const resume = async () => {
    setActionLoading(true);
    try {
      await subscriptionService.resumeSubscription();
      toast.success('Subscription resumed!');
      fetchSubscription();
    } catch (error) {
      toast.error('Failed to resume subscription');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    subscription,
    loading,
    actionLoading,
    isPremium: subscription?.plan === 'PREMIUM' && subscription?.status === 'ACTIVE',
    upgrade,
    manageSubscription,
    cancel,
    resume,
    refetch: fetchSubscription,
  };
};