import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonIcon, IonRow, IonLabel } from "@ionic/react";
import { arrowRedoOutline, cart, cartOutline, heart, heartOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { CartStore, addToCart } from "../data/CartStore";
import { addToFavourites, FavouritesStore } from "../data/FavouritesStore";
import styles from "./ProductCard.module.css";

const ProductCard = props => {

    const { product, category, index, cartRef } = props;
    const favourites = FavouritesStore.useState(s => s.product_ids);

    const productCartRef = useRef();
    const productFavouriteRef = useRef();
    const [ isFavourite, setIsFavourite ] = useState(false);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ cartObject, setCartObject ] = useState(undefined);

    useEffect(() => {

        const tempIsFavourite = favourites.find(f => f === `${ category.slug }/${ product.id }`);
        setIsFavourite(tempIsFavourite ? true : false);
    }, [props.product, favourites]); 

    useEffect(() => {
        const cartObject = shopCart.find((v) => v.categorySlug === category.slug && v.productID === product.id)
        setCartObject(cartObject);
    }, [shopCart]); 

    function addProductToFavourites(e, categorySlug, productID) {

        e.preventDefault();
        e.stopPropagation();
        addToFavourites(categorySlug, productID);


        productFavouriteRef.current.style.display = "";
        productFavouriteRef.current.classList.add("animate__fadeOutTopRight");

        setTimeout(() => {
            if (productCartRef.current) {
                productFavouriteRef.current.classList.remove("animate__fadeOutTopRight");
                productFavouriteRef.current.style.display = "none";
            }
        }, 500);
    }

    const addProductToCart = (e, categorySlug, productID) => {

        e.preventDefault();
        e.stopPropagation();

        productCartRef.current.style.display = "";
        productCartRef.current.classList.add("animate__fadeOutUp");

        setTimeout(() => {

            cartRef.current.classList.add("animate__tada");
            addToCart(categorySlug, productID);

            setTimeout(() => {
                
                cartRef.current.classList.remove("animate__tada");
                productCartRef.current.style.display = "none";
            }, 500);
        }, 500);
    }

    return (

        <IonCol size="6" key={ `category_product_list_${ index }`}>
            <IonCard routerLink={ `/category/${ category.slug }/${ product.id }`} className={ styles.categoryCard }>
                <IonCardHeader className={ styles.productCardHeader }>
                    <div className={ styles.productCardActions }>
                        <IonIcon className={ styles.productCardAction }  color={ isFavourite ? "danger" : "medium" } icon={ isFavourite ? heart : heartOutline } onClick={ e => addProductToFavourites(e, category.slug, product.id) } />
                        <IonIcon ref={ productFavouriteRef } style={{ position: "absolute", display: "none" }} className={ `${ styles.productCardAction } animate__animated` } color="danger" icon={ heart } />
                        <IonIcon className={ styles.productCardAction } size="medium" icon={ arrowRedoOutline } />
                    </div>
                    <img src={ product.image } alt="product pic" />
                    <p className="ion-text-wrap">{ product.name }</p>
                </IonCardHeader>

                <IonCardContent className={ styles.categoryCardContent }>
                    <div className={ styles.productPrice }>
                        { cartObject !== undefined ? (
                            <IonRow>
                                <IonButton color="success" onClick={ e => addProductToCart(e, category.slug, product.id) } >
                                { cartObject.count }
                                </IonButton>
                            </IonRow>
                        ) : (
                            <IonButton color="dark" onClick={ e => addProductToCart(e, category.slug, product.id) }>
                                <IonIcon icon={ cartOutline } />
                            </IonButton>
                        )}
                    
                        <IonButton style={{ width: "100%" }} color="light">
                            { product.price }
                        </IonButton>

                        <IonIcon ref={ productCartRef } icon={ cart } color="dark" style={{ position: "absolute", display: "none", fontSize: "3rem", 'pointer-events': 'none' }} className="animate__animated" />
                    </div>
                </IonCardContent>
            </IonCard>
        </IonCol>
    );
}

export default ProductCard;