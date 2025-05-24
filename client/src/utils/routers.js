const routers = {
  HOME: '',
  PROFILE: 'profile',
  CART: 'cart',
  PRODUCTS: 'products',
  CHECKOUT: 'checkout',
  ORDER_HISTORY: 'order/history',
  SHOP_MANAGEMENT: '/shop-management',
  SHOP_CENSORSHIP: '/shop-censorship',
  USER_CENSORSHIP: '/user-censorship',
  SHOP_UPSERT: '/shop-upsert/:mode/:shopId?',
  getShopUpsertPath: (mode, shopId) => {
    return shopId ? `/shop-upsert/${mode}/${shopId}` : `/shop-upsert/${mode}`;
  },
  ITEM_UPSERT: '/shop-management/:shopId/item-upsert/:mode/:itemId?',
  getItemUpsertPath: (shopId, mode, itemId) => `/shop-management/${shopId}/item-upsert/${mode}/${itemId}`,
  ITEM: '/shop-management/:shopId/item',
  getItemShopPath: (shopId) => `/shop-management/${shopId}/item`,
  SHOP_DETAIL: '/shop/:shopId',
  getShopDetailPath: (shopId) => `/shop/${shopId}`,
  ITEM_DETAIL: '/item/:itemId',
  getItemDetailPath: (itemId) => `/item/${itemId}`,
  MY_SHOP: '/myShop/:shopId/:tab',
  getMyShopPath: (shopId, tab) => `/myShop/${shopId}/${tab}`,
}

export default routers
