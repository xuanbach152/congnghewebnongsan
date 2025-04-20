const routers = {
  HOME: '',
  PROFILE: '/profile',
  PRODUCTS: '/products',
  SHOP_MANAGEMENT: '/shop-management',
  SHOP_REGISTRATION: '/shop-registration',
  ITEM_CREATION: '/shop-management/item-creation',
  ITEM: '/shop-management/:shopId/item',
  getItemShopPath: (shopId) => `/shop-management/${shopId}/item`,
  SHOP_DETAIL: '/shop/:shopId',
  getShopDetailPath: (shopId) => `/shop/${shopId}`,
  ITEM_DETAIL: '/item/:itemId',
  getItemDetailPath: (itemId) => `/item/${itemId}`,
}

export default routers
