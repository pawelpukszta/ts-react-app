import { useState } from 'react';
import { useQuery } from 'react-query';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';

import Item from './Item/Item';
import Cart from './Cart/Cart';

import { useToggle } from './hooks/useToggle';
import { CartItemType } from './types/CartItemTypes';
import { Wrapper } from './styled/App.styles';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.modal + 1,
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
}));

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
  const classes = useStyles();
  const [ cartIsOpen, showCartIsOpen ] = useToggle();
  const [ cartItems, setCartItems ] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts
  );

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
      <CssBaseline />
      <AppBar position="fixed" className={ classes.appBar } color="primary">
        <Toolbar>
          <div className={ classes.grow } />
          <IconButton edge="end" onClick={ showCartIsOpen } aria-label="Shopping cart">
            <Badge badgeContent={ getTotalItems(cartItems) } color='error'>
              <AddShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Drawer variant="temporary" anchor='right' open={ cartIsOpen } onClose={ showCartIsOpen }>
        <div className={ classes.toolbar } />
        <Cart
          cartItems={ cartItems }
          addToCart={ handleAddToCart }
          removeFromCart={ handleRemoveFromCart }
          showCartIsOpen={ showCartIsOpen }
        />
      </Drawer>

      <Grid container spacing={ 1 }>
        { data?.map(item => (
          <Grid item key={ item.id } xs={ 12 } sm={ 3 }>
            <Item item={ item } handleAddToCart={ handleAddToCart } />
          </Grid>
        )) }
      </Grid>
    </Wrapper>
  );
};

export default App;
