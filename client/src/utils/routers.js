const routers = {
  HOME: '',
  PROFILE: 'profile',
  CART: 'cart',
  PRODUCTS: 'products',
  CHECKOUT: 'checkout',
  ORDER_HISTORY: 'order/history',
  SHOP_MANAGEMENT: '/shop-management',
  SHOP_REGISTRATION: '/shop-registration',
  ITEM_CREATION: '/shop-management/:shopId/item-creation',
  getItemCreationPath: (shopId) => `/shop-management/${shopId}/item-creation`,
  ITEM: '/shop-management/:shopId/item',
  getItemShopPath: (shopId) => `/shop-management/${shopId}/item`,
  SHOP_DETAIL: '/shop/:shopId',
  getShopDetailPath: (shopId) => `/shop/${shopId}`,
  ITEM_DETAIL: '/item/:itemId',
  getItemDetailPath: (itemId) => `/item/${itemId}`,
  MY_SHOP: '/myShop/:shopId',
  getMyShopPath: (shopId) => `/myShop/${shopId}`,
}

export default routers
