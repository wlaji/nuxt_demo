import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  window.onNuxtReady(()=>{
    createPersistedState({
      reducer(state) {
        return {
          cart: state.cart,
          inquiry: state.inquiry,
          cartTemp: state.cartTemp,
          checkoutCart: state.checkoutCart,
          freeOrders: state.freeOrders
        };
      }
    })(store);
  })
};
