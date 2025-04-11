const routers = {
  HOME: '',
  PROFILE: '/profile',
  PRODUCTS: '/products',
  SHOP_MANAGEMENT: '/shop-management',
  SHOP_REGISTRATION: '/shop-registration',
  ITEM_CREATION: '/shop-management/item-creation',
  ITEM: '/shop-management/:shopId/item',
  getItemShopPath: (shopId) => `/shop-management/${shopId}/item`,
  SHOP: '/shop-management/:shopId',
  getShopPath: (shopId) => `/shop-management/${shopId}`,
}

export default routers
