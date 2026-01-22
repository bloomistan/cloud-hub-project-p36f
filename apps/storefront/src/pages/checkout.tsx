import { CartEmpty } from "@/components/cart"
import { Loading } from "@/components/ui/loading"
import { useCart } from "@/lib/hooks/use-cart"
import { type CheckoutStep, CheckoutStepKey } from "@/lib/types/global"
import {
  useLoaderData,
  useLocation,
  useNavigate,
  Link,
} from "@tanstack/react-router"
import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Thumbnail } from "@/components/ui/thumbnail"
import { Price } from "@/components/ui/price"

const DeliveryStep = lazy(() => import("@/components/checkout-delivery-step"))
const AddressStep = lazy(() => import("@/components/checkout-address-step"))
const PaymentStep = lazy(() => import("@/components/checkout-payment-step"))
const ReviewStep = lazy(() => import("@/components/checkout-review-step"))
const CheckoutSummary = lazy(() => import("@/components/checkout-summary"))

// Shopify-style step indicator
const ShopifyStepIndicator = ({
  steps,
  currentStepIndex,
}: {
  steps: CheckoutStep[]
  currentStepIndex: number
}) => {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <span
            className={`${
              index <= currentStepIndex
                ? "text-blue-600 font-medium"
                : "text-gray-400"
            } ${index === currentStepIndex ? "font-semibold" : ""}`}
          >
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <svg
              className="w-4 h-4 mx-2 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </div>
      ))}
    </nav>
  )
}

// Shopify-style order summary for sidebar
const ShopifyOrderSummary = ({
  cart,
  isCollapsed,
  setIsCollapsed,
}: {
  cart: any
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
}) => {
  const itemCount = cart?.items?.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  ) || 0

  return (
    <div className="bg-gray-50 h-full">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden w-full flex items-center justify-between p-4 border-b border-gray-200 bg-gray-100"
      >
        <div className="flex items-center gap-2 text-blue-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-sm font-medium">
            {isCollapsed ? "Show order summary" : "Hide order summary"}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isCollapsed ? "" : "rotate-180"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <Price
          price={cart?.total || 0}
          currencyCode={cart?.currency_code || "usd"}
          className="font-semibold text-lg"
        />
      </button>

      {/* Order summary content */}
      <div className={`${isCollapsed ? "hidden lg:block" : ""} p-6 lg:p-8`}>
        {/* Items */}
        <div className="space-y-4 mb-6">
          {cart?.items?.map((item: any) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative">
                <Thumbnail
                  thumbnail={item.thumbnail}
                  alt={item.product_title || item.title}
                  className="w-16 h-16 rounded-lg border border-gray-200"
                />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.product_title}
                </p>
                {item.variant_title && item.variant_title !== "Default Variant" && (
                  <p className="text-xs text-gray-500">{item.variant_title}</p>
                )}
              </div>
              <Price
                price={item.total || 0}
                currencyCode={cart.currency_code}
                className="text-sm"
              />
            </div>
          ))}
        </div>

        {/* Discount code */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Discount code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
            Apply
          </button>
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
            <Price
              price={cart?.subtotal || 0}
              currencyCode={cart?.currency_code || "usd"}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            {cart?.shipping_total ? (
              <Price
                price={cart.shipping_total}
                currencyCode={cart.currency_code}
              />
            ) : (
              <span className="text-gray-500 text-xs">Calculated at next step</span>
            )}
          </div>
          {cart?.discount_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <Price
                price={-cart.discount_total}
                currencyCode={cart.currency_code}
                className="text-green-600"
              />
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxes</span>
            <Price
              price={cart?.tax_total || 0}
              currencyCode={cart?.currency_code || "usd"}
            />
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
          <span className="text-base text-gray-900">Total</span>
          <div className="text-right">
            <span className="text-xs text-gray-500 mr-2">{cart?.currency_code?.toUpperCase()}</span>
            <Price
              price={cart?.total || 0}
              currencyCode={cart?.currency_code || "usd"}
              className="text-xl font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const Checkout = () => {
  const { step } = useLoaderData({
    from: "/$countryCode/checkout",
  })
  const { data: cart, isLoading: cartLoading } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const [isCollapsed, setIsCollapsed] = useState(true)

  const steps: CheckoutStep[] = useMemo(() => {
    return [
      {
        key: CheckoutStepKey.ADDRESSES,
        title: "Information",
        description: "Enter your contact and shipping details.",
        completed: !!(cart?.shipping_address && cart?.billing_address),
      },
      {
        key: CheckoutStepKey.DELIVERY,
        title: "Shipping",
        description: "Select a shipping method.",
        completed: !!cart?.shipping_methods?.length,
      },
      {
        key: CheckoutStepKey.PAYMENT,
        title: "Payment",
        description: "Select a payment method.",
        completed: !!cart?.payment_collection?.payment_sessions?.length,
      },
      {
        key: CheckoutStepKey.REVIEW,
        title: "Review",
        description: "Review and place your order.",
        completed: false,
      },
    ]
  }, [cart])

  const currentStepIndex = useMemo(
    () => steps.findIndex((s) => s.key === step),
    [step, steps]
  )

  const goToStep = (step: CheckoutStepKey) => {
    navigate({
      to: `${location.pathname}?step=${step}`,
      replace: true,
    })
  }

  useEffect(() => {
    if (!cart) return

    if (
      step !== CheckoutStepKey.ADDRESSES &&
      currentStepIndex >= 0 &&
      !steps[0].completed
    ) {
      goToStep(CheckoutStepKey.ADDRESSES)
      return
    }

    if (
      step !== CheckoutStepKey.DELIVERY &&
      currentStepIndex >= 1 &&
      !steps[1].completed
    ) {
      goToStep(CheckoutStepKey.DELIVERY)
      return
    }

    if (
      step !== CheckoutStepKey.PAYMENT &&
      currentStepIndex >= 2 &&
      !steps[2].completed
    ) {
      goToStep(CheckoutStepKey.PAYMENT)
      return
    }
  }, [cart, steps, location])

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      goToStep(steps[nextIndex].key)
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      goToStep(steps[prevIndex].key)
    }
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!cart || !cart.items?.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="content-container py-16">
          <CartEmpty />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Checkout form */}
        <div className="flex-1 lg:pr-8 xl:pr-16">
          <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
            {/* Logo */}
            <Link to={`/${countryCode}` as any} className="block mb-8">
              <h1 className="text-2xl font-bold text-blue-700">Soquio</h1>
            </Link>

            {/* Breadcrumb navigation */}
            <ShopifyStepIndicator steps={steps} currentStepIndex={currentStepIndex} />

            {/* Mobile order summary toggle */}
            <div className="lg:hidden mb-6">
              <ShopifyOrderSummary
                cart={cart}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </div>

            {/* Step content */}
            <div className="space-y-6">
              <Suspense fallback={<Loading />}>
                {step === CheckoutStepKey.ADDRESSES && (
                  <AddressStep cart={cart} onNext={handleNext} />
                )}

                {step === CheckoutStepKey.DELIVERY && (
                  <DeliveryStep
                    cart={cart}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {step === CheckoutStepKey.PAYMENT && (
                  <PaymentStep
                    cart={cart}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {step === CheckoutStepKey.REVIEW && (
                  <ReviewStep cart={cart} onBack={handleBack} />
                )}
              </Suspense>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <Link to={`/${countryCode}` as any} className="hover:text-blue-600">
                  Refund policy
                </Link>
                <Link to={`/${countryCode}` as any} className="hover:text-blue-600">
                  Privacy policy
                </Link>
                <Link to={`/${countryCode}` as any} className="hover:text-blue-600">
                  Terms of service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Order summary (desktop) */}
        <div className="hidden lg:block lg:w-[45%] xl:w-[40%] bg-gray-50 border-l border-gray-200">
          <div className="sticky top-0 p-8 xl:p-12">
            {/* Items */}
            <div className="space-y-4 mb-6">
              {cart?.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <Thumbnail
                      thumbnail={item.thumbnail}
                      alt={item.product_title || item.title}
                      className="w-16 h-16 rounded-lg border border-gray-200 bg-white"
                    />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product_title}
                    </p>
                    {item.variant_title && item.variant_title !== "Default Variant" && (
                      <p className="text-xs text-gray-500">{item.variant_title}</p>
                    )}
                  </div>
                  <Price
                    price={item.total || 0}
                    currencyCode={cart.currency_code}
                    className="text-sm font-medium"
                  />
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />

            {/* Discount code */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Discount code or gift card"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              <button className="px-5 py-3 bg-gray-200 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                Apply
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <Price
                  price={cart?.subtotal || 0}
                  currencyCode={cart?.currency_code || "usd"}
                  className="font-medium"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                {cart?.shipping_total ? (
                  <Price
                    price={cart.shipping_total}
                    currencyCode={cart.currency_code}
                    className="font-medium"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">Calculated at next step</span>
                )}
              </div>
              {cart?.discount_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <Price
                    price={-cart.discount_total}
                    currencyCode={cart.currency_code}
                    className="text-green-600 font-medium"
                  />
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated taxes</span>
                <Price
                  price={cart?.tax_total || 0}
                  currencyCode={cart?.currency_code || "usd"}
                  className="font-medium"
                />
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <div className="text-right flex items-baseline gap-2">
                <span className="text-xs text-gray-500 uppercase">
                  {cart?.currency_code}
                </span>
                <Price
                  price={cart?.total || 0}
                  currencyCode={cart?.currency_code || "usd"}
                  className="text-2xl font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
