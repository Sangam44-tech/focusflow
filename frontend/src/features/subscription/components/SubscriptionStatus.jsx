// frontend/src/features/subscription/components/SubscriptionStatus.jsx
import { format } from 'date-fns';
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';

export const SubscriptionStatus = ({
  subscription,
  onManage,
  onCancel,
  onResume,
  loading,
}) => {
  const isPremium = subscription?.plan === 'PREMIUM';
  const isActive = subscription?.status === 'ACTIVE';
  const isPastDue = subscription?.status === 'PAST_DUE';
  const willCancel = subscription?.cancelAtPeriodEnd;

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900 flex items-center">
          <CreditCardIcon className="w-5 h-5 mr-2" />
          Subscription Status
        </h3>
      </CardHeader>
      <CardBody>
        {/* Current Plan */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Current Plan</p>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-gray-900">
                {subscription?.planDetails?.name || 'Free'}
              </span>
              {isPremium && isActive && (
                <CheckBadgeIcon className="w-6 h-6 text-green-500 ml-2" />
              )}
            </div>
          </div>
          
          {isPremium && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive && !willCancel
                ? 'bg-green-100 text-green-700'
                : isPastDue
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {isPastDue ? 'Past Due' : willCancel ? 'Canceling' : 'Active'}
            </span>
          )}
        </div>

        {/* Past Due Warning */}
        {isPastDue && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Payment Failed</p>
              <p className="text-sm text-red-600">
                Please update your payment method to continue your subscription.
              </p>
            </div>
          </div>
        )}

        {/* Cancellation Warning */}
        {willCancel && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Subscription Ending</p>
              <p className="text-sm text-yellow-600">
                Your subscription will end on{' '}
                {format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        )}

        {/* Billing Info */}
        {isPremium && subscription?.currentPeriodEnd && !willCancel && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Next billing date</p>
            <p className="font-medium text-gray-900">
              {format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {isPremium && (
            <>
              <Button variant="secondary" onClick={onManage} loading={loading}>
                Manage Billing
              </Button>
              
              {willCancel ? (
                <Button variant="primary" onClick={onResume} loading={loading}>
                  Resume Subscription
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  loading={loading}
                  className="text-red-600 hover:bg-red-50"
                >
                  Cancel Subscription
                </Button>
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};