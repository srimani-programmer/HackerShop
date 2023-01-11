import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import RightPanel from './rightPanel';
import LeftPanel from './leftPanel';

const Shop = (props) => {
    const { items } = props
    const [cart, setCart] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [coupon, setCoupon] = useState(0);

    const addItem = (item) => {
        if (cart.some(cartItem => cartItem.name === item.name)) {
            setCart(prevCart => {
                const newCart = prevCart.map((cartItem) => {
                    if (cartItem.name === item.name) {
                        let price = Number(cartItem.totalPrice) + Number(item.price);
                        setSubTotal(prevTotal => {
                            return Number(Number(prevTotal) + Number(item.price)).toFixed(2);
                        });
                        return { ...cartItem, quantity: cartItem.quantity + 1, totalPrice: Number(price) };
                    }
                    return cartItem;
                });
                return newCart;
            })
        } else {
            setCart(prevCart => {
                let newCart = [...prevCart];
                newCart.push({ ...item, quantity: 1, totalPrice: Number(item.price) });
                setSubTotal(prevTotal => {
                    return Number(Number(prevTotal) + Number(item.price)).toFixed(2);
                });

                return newCart;
            });
        }
    }

    const removeItem = (item) => {
        if (cart.some(cartItem => cartItem.name === item.name)) {
            // let removeIndex = -1;
            // let isEmpty = false;

            setCart((prevCart, index) => {
                const newCart = prevCart.map((cartItem) => {
                    if (cartItem.name === item.name) {
                        if (cartItem.quantity > 0) {
                            let price = Number(cartItem.totalPrice) - Number(item.price);
                            let quantity = Number(cartItem.quantity) - 1;
                            setSubTotal(prevTotal => {
                                return Number(Number(prevTotal) - Number(item.price)).toFixed(2);
                            });
                            if (quantity === 0) {
                                return {};
                            }
                            return { ...cartItem, quantity, totalPrice: price };
                        }
                    }
                    return cartItem;
                })

                // if (removeIndex !== -1 && isEmpty) {
                //     newCart.splice(removeIndex, 1);
                //     removeIndex = -1;
                //     isEmpty = false;
                // }

                return newCart;
            });
        }
    }

    const calcSubTotal = (newCart, tempCoupon) => {
        if (newCart !== undefined && newCart !== null && newCart !== []) {
            if (tempCoupon === 25) {
                setCoupon(tempCoupon);
                let subtotalValue = getTotalSubtotalValue(newCart, 0.25);
                setSubTotal(subtotalValue);
            } else if (tempCoupon === 15) {
                setCoupon(tempCoupon);
                let subtotalValue = getTotalSubtotalValue(newCart, 0.15);
                setSubTotal(subtotalValue);
            } else if (tempCoupon === 0) {
                setCoupon(tempCoupon);
                let subtotalValue = getTotalSubtotalValue(newCart, 0);
                setSubTotal(subtotalValue);
            }
        }
    }

    const getTotalSubtotalValue = (cartItems, couponPercentage) => {
        let total = 0;

        if (cartItems && cartItems.length > 0) {
            cartItems.forEach((item) => {
                total += Number(item.totalPrice);
            });
        }

        let percentageValue = total * couponPercentage;
        total = total - percentageValue;

        return total.toFixed(2);
    }

    const handleCouponChange = event => {
        setCoupon(event.target.value);
        calcSubTotal(cart, event.target.value);
    };

    return (
        <div>
            <Grid className='GridRoot'>
                <LeftPanel items={items} addItem={addItem} removeItem={removeItem} />
                <Divider orientation="vertical" />
                <RightPanel cart={cart} coupon={coupon}
                    handleCouponChange={handleCouponChange} subTotal={subTotal} />
            </Grid>
        </div>
    );
}


export default Shop;
