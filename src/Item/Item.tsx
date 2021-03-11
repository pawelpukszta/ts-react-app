import Button from '@material-ui/core/Button';
import { CartItemType } from '../types/CartItemTypes';
import { Wrapper } from './styled/Item.styles';

type Props = {
    item: CartItemType;
    handleAddToCart: (clickedItemType: CartItemType) => void;
};

const Item: React.FC<Props> = ({ item, handleAddToCart }) => (
    <Wrapper>
        <img src={ item.image } alt={ item.title } />
        <div>
            <h3>{ item.title }</h3>
            <p>{ item.description }</p>
            <h3>${ item.price }</h3>
        </div>
        <Button onClick={ () => handleAddToCart(item) }>Add to cart</Button>
    </Wrapper>
);
export default Item;