import CartItem from '../CartItem/CartItem';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Wrapper } from './styled/Cart.styles';
import { CartItemType } from '../types/CartItemTypes';

type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
    showCartIsOpen: () => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart, showCartIsOpen }) => {
    const calculateTotal = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount * item.price, 0);

    return (
        <Wrapper>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <h2>Shopping cart</h2>
                <IconButton onClick={ showCartIsOpen }>
                    <CloseIcon />
                </IconButton>
            </Grid>

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