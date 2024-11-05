// import React, { createContext, useContext, PropsWithChildren, useState } from 'react';
// import { Product, CartItem } from '@/types';

// type CartContextType = {
//   items: CartItem[];  // Adjust this type if you need a more specific type for items
//   addItem: (product: Product, size: CartItem['size']) => void;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// const CartProvider = ({ children }: PropsWithChildren) => {
//   const [items, setItems] = useState<number[]>([1, 2, 3]);

//   const addItem = (product: Product, size: CartItem['size']) => {
//     // Add item logic here

//   const prevItems: CartItem = {
//     id: "1",
//     product,
//     product_id: product.id,
//     size,
//     quantity: 1,
//   }

//   setItems((prevItems) => [...prevItems, { ...product, size }]);

//   };

//   return (
//     <CartContext.Provider value={{ items, addItem }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };


import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Product, CartItem,PizzaSize } from '@/types';

import {randomUUID} from 'expo-crypto'
type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem["size"]) => void;
    updateQuantity: (itemId: string, amount: -1 | 1 ) => void,
    total: number
}

export const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},
    updateQuantity: () => {},
    total: 0,
});


const CartProvider = ({children}:PropsWithChildren) =>{
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: Product, size: CartItem["size"]) => {

        const existingItem = items.find(
            (item) => item.product === product && item.size === size
        );

        if(existingItem) {
            updateQuantity(existingItem.id, 1)
            return; 
        }
        const newCartItem: CartItem = {
            id: randomUUID(),
            product_id: product.id,
            product,
            size,
            quantity: 1,
            
        }

        setItems([newCartItem, ...items])
    }

    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        const updatedItems = items.map(item => item.id !== itemId ? item :{...item, quantity: item.quantity + amount} ).filter((item) => item.quantity > 0)

        setItems(updatedItems)
    }
    const total = parseFloat(items.reduce((sum, item) => (sum += item.product.price * item.quantity), 0).toFixed(2))
    return (
    <CartContext.Provider value={{items, addItem, updateQuantity, total}}>
        {children}

    </CartContext.Provider>
    )
}

export default CartProvider

export const useCart = () => useContext(CartContext)