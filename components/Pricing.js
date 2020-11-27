import cn from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postData } from '../utils/helpers';
import { getStripe } from '../utils/initStripejs';
import { useAuth } from '../utils/useAuth';
import Button from './Button/Button';

export default function Pricing({ products }) {
  const [billingInterval, setBillingInterval] = useState('month');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session } = useAuth();

  const handleCheckout = async (price) => {
    setLoading(true);
    if (!session) {
      router.push('/signin');
      return;
    }
    const { sessionId } = await postData({
      url: '/api/createCheckoutSession',
      data: { price },
      token: session.access_token
    });
    const stripe = await getStripe();
    const { error } = stripe.redirectToCheckout({ sessionId });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <section>
      <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>
          <div className="relative self-center mt-6 bg-primary-2 rounded-lg p-0.5 flex sm:mt-8 border border-accents-0">
            <button
              onClick={() => setBillingInterval('month')}
              type="button"
              className={`${
                billingInterval === 'month'
                  ? 'relative w-1/2 bg-secondary border-accents-0 rounded-md shadow-sm text-primary-2'
                  : 'ml-0.5 relative w-1/2 border border-transparent rounded-mdm text-accents-4'
              } m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              type="button"
              className={`${
                billingInterval === 'year'
                  ? 'relative w-1/2 bg-secondary border-accents-0 rounded-md shadow-sm text-primary-2'
                  : 'ml-0.5 relative w-1/2 border border-transparent rounded-mdm text-accents-4'
              } m-1 py-2 text-sm font-medium  whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8`}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
          {products.map((product) => {
            const price = product.prices.find(
              (price) => price.interval === billingInterval
            );
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency,
              minimumFractionDigits: 0
            }).format(price.unit_amount / 100);
            return (
              <div
                key={product.id}
                className={cn(
                  'rounded-lg shadow-sm divide-y divide-accents-2 bg-primary-2',
                  {
                    'border border-pink': product.name === 'Freelancer'
                  }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl leading-6 font-semibold text-white">
                    {product.name}
                  </h2>
                  <p className="mt-4 text-accents-5">
                    All the basics for starting a new business
                  </p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-accents-8">
                      /{billingInterval}
                    </span>
                  </p>
                  <Button
                    variant="slim"
                    type="button"
                    loading={loading}
                    onClick={() => handleCheckout(price.id)}
                    className="mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                  >
                    {`Buy ${product.name}`}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <p className="mt-24 text-xs uppercase text-accents-3 text-center font-bold tracking-widest">
            Brought to you by
          </p>
          <div className="flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-4">
            <div className="flex items-center justify-start">
              <a href="https://nextjs.org" aria-label="Next.js Link">
                <img
                  src="/nextjs.svg"
                  alt="Next.js Logo"
                  className="h-12 text-primary"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://vercel.com" aria-label="Vercel.com Link">
                <img
                  src="/vercel.svg"
                  alt="Vercel.com Logo"
                  className="h-6 text-primary"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://stripe.com" aria-label="stripe.com Link">
                <img
                  src="/stripe.svg"
                  alt="stripe.com Logo"
                  className="h-12 text-primary"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://supabase.io" aria-label="supabase.io Link">
                <img
                  src="/supabase.svg"
                  alt="supabase.io Logo"
                  className="h-12 text-primary"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
