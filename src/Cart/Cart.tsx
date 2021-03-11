import CartItem from '../CartItem/CartItem';
import { Wrapper } from './styled/Cart.styles';
import { CartItemType } from '../types/CartItemTypes';

type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {

    const calculateTotal = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount * item.price, 0);
    return (
        <Wrapper>
            <h2>Shopping cart</h2>
            {cartItems.length === 0 ? <p>No items in cart</p> : null }
            {cartItems.map(item => (
                <CartItem
                    key={ item.id }
                    item={ item }
                    addToCart={ addToCart }
                    removeFromCart={ removeFromCart }
                />
            )) }
            {calculateTotal(cartItems) > 0 ? (
                <h2>Total: ${calculateTotal(cartItems).toFixed(2) }</h2>
            ) : null }
        </Wrapper>
    );
};

export default Cart;