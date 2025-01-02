// // import React, { createContext, useContext, PropsWithChildren, useState } from 'react';
// // import { Product, CartItem } from '@/types';

// // type CartContextType = {
// //   items: CartItem[];  // Adjust this type if you need a more specific type for items
// //   addItem: (product: Product, size: CartItem['size']) => void;
// // };

// // const CartContext = createContext<CartContextType | undefined>(undefined);

// // const CartProvider = ({ children }: PropsWithChildren) => {
// //   const [items, setItems] = useState<number[]>([1, 2, 3]);

// //   const addItem = (product: Product, size: CartItem['size']) => {
// //     // Add item logic here

// //   const prevItems: CartItem = {
// //     id: "1",
// //     product,
// //     product_id: product.id,
// //     size,
// //     quantity: 1,
// //   }

// //   setItems((prevItems) => [...prevItems, { ...product, size }]);

// //   };

// //   return (
// //     <CartContext.Provider value={{ items, addItem }}>
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // export default CartProvider;

// // export const useCart = () => {
// //   const context = useContext(CartContext);
// //   if (!context) {
// //     throw new Error("useCart must be used within a CartProvider");
// //   }
// //   return context;
// // };


// import { createContext, PropsWithChildren, useContext, useState } from "react";
// import { Product, CartItem,PizzaSize } from '@/types';


// import {randomUUID} from 'expo-crypto'
// import { Tables } from "@/database.types";
// import { useInsertOrder } from "@/api/orders";
// import { useInsertOrderItems } from "@/api/order-items";
// import { router } from "expo-router";


// type Product=Tables<'product'>;
// type CartType = {
//   items: CartItem[];
//   addItem: (product: Product, size: CartItem['size']) => void;
//   updateQuantity: (itemId: string, amount: -1 | 1) => void;
//   total: number;
//   checkout: () => void;
// }

// export const CartContext = createContext<CartType>({
//   items: [],
//   addItem: () => {},
//   updateQuantity: () => {},
//   total: 0,
//   checkout: () => {},
// });


// const CartProvider = ({children}:PropsWithChildren) =>{
//     const [items, setItems] = useState<CartItem[]>([]);
//     const { mutate: insertOrder } = useInsertOrder();
//   const { mutate: insertOrderItems } = useInsertOrderItems();

//     const addItem = (product: Product, size: CartItem["size"]) => {

//         const existingItem = items.find(
//             (item) => item.product === product && item.size === size
//         );

//         if(existingItem) {
//             updateQuantity(existingItem.id, 1)
//             return; 
//         }
//         const newCartItem: CartItem = {
//             id: randomUUID(),
//             product_id: product.id,
//             product,
//             size,
//             quantity: 1,
            
//         }

//         setItems([newCartItem, ...items])
//     }

    

//     const updateQuantity = (itemId: string, amount: -1 | 1) => {
//         const updatedItems = items.map(item => item.id !== itemId ? item :{...item, quantity: item.quantity + amount} ).filter((item) => item.quantity > 0)

//         setItems(updatedItems)
//     }
//     const total = parseFloat(items.reduce((sum, item) => (sum += item.product.price * item.quantity), 0).toFixed(2))


//     const clearCart = () => {
//       setItems([]);
//     };
  

//     const checkout = () => {
//       insertOrder(
//         { total },
//         {
//           onSuccess: saveOrderItems,
//         }
//       );
//     };
  
//     const saveOrderItems = (order: Tables<'orders'>) => {
//       const orderItems = items.map((cartItem) => ({
//         order_id: order.id,
//         product_id: cartItem.product_id,
//         quantity: cartItem.quantity,
//         size: cartItem.size,
//       }));
  
//       insertOrderItems(orderItems, {
//         onSuccess() {
//           clearCart();
//           router.push(`/(user)/orders/${order.id}`);
//         },
//       });
//     };
//     return (
//     <CartContext.Provider value={{items, addItem, updateQuantity, total}}>
//         {children}

//     </CartContext.Provider>
//     )
// }

// export default CartProvider

// export const useCart = () => useContext(CartContext)

import { CartItem, Tables, Order } from '@/types';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { randomUUID } from 'expo-crypto';
import { useInsertOrder } from '@/api/orders';
import { useRouter } from 'expo-router';
import { useInsertOrderItems } from '@/api/order-items';
// import { initialisePaymentSheet, openPaymentSheet } from '@/lib/stripe';

type Product = Tables<'product'>;

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem['size']) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const router = useRouter();

  const addItem = (product: Product, size: CartItem['size']) => {
    // if already in cart, increment quantity
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      id: randomUUID(), // generate
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  // updateQuantity
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems(
      items
        .map((item) =>
          item.id !== itemId
            ? item
            : { ...item, quantity: item.quantity + amount }
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );

  const clearCart = () => {
    setItems([]);
  };

  const checkout = async () => {
    const totalAmount = Math.round(total); // Convert to integer
    console.log('Checkout function called with total:', totalAmount);
  
    insertOrder(
      { total: totalAmount },
      {
        onSuccess: (order) => {
          console.log('Order inserted successfully:', order);
          saveOrderItems(order);
        },
        onError: (error) => {
          console.error('Error inserting order:', error);
        },
      }
    );
  };
  

  const saveOrderItems = (order: Tables<'orders'>) => {
    console.log('Order saved:', order);
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size,
    }));
  
    insertOrderItems(orderItems as Tables<'order_items'>[], {
      onSuccess() {
        console.log('Order items inserted');
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
      onError: (error) => {
        console.error('Error inserting order items:', error);
      },
    });
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
