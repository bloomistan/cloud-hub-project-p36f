import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useLatestProducts } from "@/lib/hooks/use-products"
import { useRegion } from "@/lib/hooks/use-regions"
import ProductCard from "@/components/product-card"
import { ShoppingBag } from "@medusajs/icons"

// Custom icons as inline SVGs
const TruckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
)

const LeafIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9 0 4.97 4.03 9 9 9-4.97 0-9 4.03-9 9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const ReturnIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
  </svg>
)

const HERO_IMAGE =
  "https://cdn.mignite.app/ws/works_01KFK2YR58ZHSMXKTCZJ84P36F/generated-01KFK49XTEC1HQHQ632BMNP4CV-01KFK49XTEAN14VYJ0TBQ35MRA.jpeg"

const Home = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const { data: region } = useRegion({
    country_code: countryCode || "us",
  })

  const { data } = useLatestProducts({
    limit: 8,
    region_id: region?.id,
  })

  const products = data?.products || []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Fresh groceries"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soquio-blue/90 via-soquio-blue/70 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="content-container relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <LeafIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Fresh & Organic</span>
            </div>

            <h1 className="font-[Outfit] text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Fresh Food,
              <br />
              <span className="text-soquio-red-light">Better Life</span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-lg">
              Discover the freshest groceries delivered straight to your
              doorstep. Quality produce, everyday essentials, and gourmet finds.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to={`${baseHref}/store` as string}
                className="bg-soquio-red text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-soquio-red-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </Link>
              <Link
                to={`${baseHref}/store` as string}
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-soquio-blue transition-all duration-300 inline-flex items-center gap-2"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-soquio-blue py-6 border-y-4 border-soquio-red">
        <div className="content-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { Icon: TruckIcon, text: "Free Delivery", desc: "Orders over $50" },
              { Icon: LeafIcon, text: "100% Fresh", desc: "Quality guaranteed" },
              { Icon: ClockIcon, text: "Same Day", desc: "Express delivery" },
              { Icon: ReturnIcon, text: "Easy Returns", desc: "30-day policy" },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-3 text-white"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <feature.Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">{feature.text}</p>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="content-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-soquio-red font-semibold text-sm uppercase tracking-wider">
                Our Selection
              </span>
              <h2 className="font-[Outfit] text-4xl md:text-5xl font-bold text-gray-900 mt-2">
                Fresh <span className="text-soquio-blue">Picks</span> for You
              </h2>
            </div>
            <Link
              to={`${baseHref}/store` as string}
              className="mt-4 md:mt-0 text-soquio-blue font-semibold hover:text-soquio-blue-dark transition-colors inline-flex items-center gap-2 group"
            >
              View All Products
              <span className="group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-soquio-blue/30 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl aspect-[29/34] animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-soquio-cream">
        <div className="content-container">
          <div className="bg-soquio-blue rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="font-[Outfit] text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Fill Your Cart?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of happy customers who trust Soquio for their
                weekly grocery needs.
              </p>
              <Link
                to={`${baseHref}/store` as string}
                className="bg-soquio-red text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-soquio-red-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
