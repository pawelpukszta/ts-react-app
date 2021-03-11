import { useState } from 'react';
import { useQuery } from 'react-query';

import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';

import Item from './Item/Item';
import Cart from './Cart/Cart';

import { CartItemType } from './types/CartItemTypes';
import { Wrapper, StyledButton } from './styled/App.styles';

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
  const [ cartIsOpen, setCartIsOpen ] = useState(false);
  const [ cartItems, setCartItems ] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts
  );
  console.log(data);

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      // First time the item is added to cart
      return [ ...prev, { ...clickedItem, amount: 1 } ];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [ ...ack, { ...item, amount: item.amount - 1 } ];
        } else {
          return [ ...ack, item ];
        }
      }, [] as CartItemType[])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;

  return (
    <Wrapper>
      <Drawer anchor='right' open={ cartIsOpen } onClose={ () => setCartIsOpen(false) }>
        <Cart
          cartItems={ cartItems }
          addToCart={ handleAddToCart }
          removeFromCart={ handleRemoveFromCart }
        />
      </Drawer>
      <StyledButton onClick={ () => setCartIsOpen(true) }>
        <Badge badgeContent={ getTotalItems(cartItems) } color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={ 3 }>
        { data?.map(item => (
          <Grid item key={ item.id } xs={ 12 } sm={ 4 }>
            <Item item={ item } handleAddToCart={ handleAddToCart } />
          </Grid>
        )) }
      </Grid>
    </Wrapper>
  );
};

export default App;
