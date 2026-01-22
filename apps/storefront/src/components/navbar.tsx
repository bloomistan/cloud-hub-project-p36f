import { CartDropdown } from "@/components/cart"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useCategories } from "@/lib/hooks/use-categories"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Link, useLocation } from "@tanstack/react-router"
import { ShoppingBag } from "@medusajs/icons"

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const { data: topLevelCategories } = useCategories({
    fields: "id,name,handle,parent_category_id",
    queryParams: { parent_category_id: "null" },
  })

  const categoryLinks = [
    { id: "shop-all", name: "Shop all", to: `${baseHref}/store` },
    ...(topLevelCategories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      to: `${baseHref}/categories/${cat.handle}`,
    })) ?? []),
  ]

  return (
    <div className="sticky top-0 inset-x-0 z-40">
      <header className="relative h-16 mx-auto border-b bg-white border-gray-200">
        <nav className="content-container text-sm font-medium text-gray-700 flex items-center justify-between w-full h-full">
          {/* Desktop Navigation */}
          <NavigationMenu.Root className="hidden lg:flex items-center h-full">
            <NavigationMenu.List className="flex items-center gap-x-6 h-full">
              {/* Shop dropdown */}
              <NavigationMenu.Item className="h-full flex items-center">
                <NavigationMenu.Trigger className="text-gray-700 hover:text-soquio-blue h-full flex items-center gap-1 select-none font-semibold transition-colors">
                  Shop
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="content-container py-12">
                  <div className="grid grid-cols-2 gap-12">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-soquio-blue text-base font-bold uppercase tracking-wider">
                        Categories
                      </h3>
                      <div className="flex flex-col gap-3">
                        {categoryLinks.map((link) => (
                          <NavigationMenu.Link key={link.id} asChild>
                            <Link
                              to={link.to}
                              className="text-gray-700 hover:text-soquio-blue text-base font-medium transition-colors"
                            >
                              {link.name}
                            </Link>
                          </NavigationMenu.Link>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="aspect-square bg-soquio-cream rounded-xl flex items-center justify-center border-2 border-soquio-blue/10">
                        <div className="text-center p-4">
                          <span className="text-soquio-red font-bold text-lg">Fresh Daily</span>
                          <p className="text-gray-600 text-sm mt-1">New arrivals every morning</p>
                        </div>
                      </div>
                      <div className="aspect-square bg-soquio-blue rounded-xl flex items-center justify-center">
                        <div className="text-center p-4">
                          <span className="text-white font-bold text-lg">Free Delivery</span>
                          <p className="text-white/70 text-sm mt-1">On orders over $50</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Viewport
              className="absolute top-full bg-white border-b border-gray-200 shadow-lg overflow-hidden
                data-[state=open]:animate-[dropdown-open_300ms_ease-out]
                data-[state=closed]:animate-[dropdown-close_300ms_ease-out]"
              style={{ left: "50%", transform: "translateX(-50%)", width: "100vw" }}
            />
          </NavigationMenu.Root>

          {/* Mobile Menu */}
          <Drawer>
            <DrawerTrigger className="lg:hidden text-soquio-blue hover:text-soquio-blue-dark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </DrawerTrigger>
            <DrawerContent side="left">
              <DrawerHeader className="border-b border-gray-200">
                <DrawerTitle className="text-soquio-blue font-bold uppercase tracking-wider">Menu</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col py-4">
                <div className="px-6 py-4 text-soquio-blue text-lg font-bold">
                  Shop
                </div>
                <div className="flex flex-col">
                  {categoryLinks.map((link) => (
                    <DrawerClose key={link.id} asChild>
                      <Link
                        to={link.to}
                        className="px-10 py-3 text-gray-700 hover:bg-soquio-cream hover:text-soquio-blue transition-colors font-medium"
                      >
                        {link.name}
                      </Link>
                    </DrawerClose>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Logo */}
          <div className="flex items-center h-full absolute left-1/2 transform -translate-x-1/2">
            <Link
              to={baseHref || "/"}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-soquio-blue rounded-lg flex items-center justify-center group-hover:bg-soquio-blue-dark transition-colors">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold text-soquio-blue group-hover:text-soquio-blue-dark transition-colors font-[Outfit]">
                Soquio
              </span>
            </Link>
          </div>

          {/* Cart */}
          <div className="flex items-center gap-x-6 h-full justify-end">
            <CartDropdown />
          </div>
        </nav>
      </header>
    </div>
  )
}
