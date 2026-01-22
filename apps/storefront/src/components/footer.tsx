import CountrySelect from "@/components/country-select"
import { useCategories } from "@/lib/hooks/use-categories"
import { useRegions } from "@/lib/hooks/use-regions"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"
import { ShoppingBag } from "@medusajs/icons"

const Footer = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const { data: categories } = useCategories({
    fields: "name,handle",
    queryParams: {
      parent_category_id: "null",
      limit: 5,
    },
  })

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  })

  return (
    <footer
      className="bg-soquio-blue text-white w-full"
      data-testid="footer"
    >
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between py-16">
          <div className="lg:w-1/3 flex flex-col gap-y-4">
            <Link
              to={baseHref || "/"}
              className="flex items-center gap-2 group w-fit"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-soquio-blue" />
              </div>
              <span className="text-2xl font-bold text-white font-[Outfit]">
                Soquio
              </span>
            </Link>
            <p className="text-white/80 max-w-md text-base">
              Your trusted neighborhood grocery store, now online. Fresh
              produce, quality products, and fast delivery to your doorstep.
            </p>
            <div className="mt-2">
              <CountrySelect regions={regions ?? []} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            {categories && categories.length > 0 ? (
              <FooterColumn
                title="Shop"
                links={[
                  { name: "All Products", url: `${baseHref}/store`, isExternal: false },
                  ...categories.map((category) => ({
                    name: category.name,
                    url: `${baseHref}/categories/${category.handle}`,
                    isExternal: false,
                  })),
                ]}
              />
            ) : (
              <FooterColumn
                title="Shop"
                links={[
                  { name: "All Products", url: `${baseHref}/store`, isExternal: false },
                ]}
              />
            )}
            <FooterColumn
              title="Help"
              links={[
                { name: "Contact Us", url: "/", isExternal: false },
                { name: "FAQ", url: "/", isExternal: false },
                { name: "Shipping Info", url: "/", isExternal: false },
                { name: "Returns", url: "/", isExternal: false },
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                { name: "About Us", url: "/", isExternal: false },
                { name: "Blog", url: "/", isExternal: false },
                { name: "Careers", url: "/", isExternal: false },
              ]}
            />
          </div>
        </div>
        <div className="border-t border-white/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-white/70">
              {new Date().getFullYear()} Soquio. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                className="text-sm text-white/70 hover:text-white transition-colors"
                to={"/"}
              >
                Privacy Policy
              </Link>
              <Link
                className="text-sm text-white/70 hover:text-white transition-colors"
                to={"/"}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FooterColumn = ({
  title,
  links,
}: {
  title: string
  links: {
    name: string
    url: string
    isExternal: boolean
  }[]
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="text-white text-sm font-bold uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.url + link.name} className="text-sm">
            {link.isExternal ? (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                to={link.url}
                className="text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Footer
