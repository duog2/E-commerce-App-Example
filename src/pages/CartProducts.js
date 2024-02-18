import { IonAvatar, IonBadge, IonButton, IonButtons, IonCardSubtitle, IonCol, IonContent, IonFabButton, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { cart, checkmarkSharp, chevronBackOutline, trashOutline, heart } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { CartStore, removeFromCart, addToCart } from "../data/CartStore";
import { ProductStore } from "../data/ProductStore";
import { FavouritesStore } from "../data/FavouritesStore";

import styles from "./CartProducts.module.css";

const CartProducts = () => {

    const cartRef = useRef();
    const products = ProductStore.useState(s => s.products);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ cartProducts, setCartProducts ] = useState([]);
    const favourites = FavouritesStore.useState(s => s.product_ids);
    const [ total, setTotal ] = useState(0);

    useEffect(() => {

        const getCartProducts = () => {

            setCartProducts([]);
            setTotal(0);

            shopCart.forEach(product => {                
                const tempCategory = products.filter(p => p.slug === product.categorySlug)[0];
                const tempProduct = tempCategory.products.filter(p => parseInt(p.id) === parseInt(product.productID))[0];

                const unitCost = Number.parseFloat(tempProduct.price.substr(1));
                const totalCost = (unitCost * product.count).toFixed(2);

                const tempCartProduct = {
                    count: product.count,
                    category: tempCategory,
                    product: tempProduct,
                    displayPrice: tempProduct.price.substr(0,1) + totalCost
                };

                setTotal(prevTotal => prevTotal + parseInt(tempProduct.price.replace("£", "")) * product.count);
                setCartProducts(prevSearchResults => [ ...prevSearchResults, tempCartProduct ]);
            });
        }

        getCartProducts();
    }, [ shopCart ]);

    const removeProductFromCart = async (index) => {

        removeFromCart(index);
    }

    return (

        <IonPage id="category-page" className={ styles.categoryPage }>
            <IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" routerLink="/" routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;Categories
                        </IonButton>
                    </IonButtons>
					<IonTitle>Cart</IonTitle>

                    <IonButtons slot="end">
                        <IonBadge color="danger">
                            { favourites.length }
                        </IonBadge>
						<IonButton color="danger" routerLink="/favourites">
							<IonIcon icon={ heart } />
						</IonButton>
                        <IonBadge color="dark">
                            { shopCart.reduce((counter, newVal) => counter += newVal.count, 0) }
                        </IonBadge>
						<IonButton color="dark">
							<IonIcon ref={ cartRef } className="animate__animated" icon={ cart } />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			
			<IonContent fullscreen>

                    <IonRow className="ion-text-center ion-margin-top">
                        <IonCol size="12">
                            <IonNote>{ cartProducts && cartProducts.length } { (cartProducts.length > 1 || cartProducts.length === 0) ? " products" : " product" } found</IonNote>
                        </IonCol>
                    </IonRow>

                    <IonList>
                        { cartProducts && cartProducts.map((product, index) => {
                            return (
                                <IonCol>
                                    <IonItem key={ index } lines="none" detail={ false } className={ styles.cartItem }>
                                        <IonAvatar>
                                            <IonImg src={ product.product.image } />
                                        </IonAvatar>
                                        <IonLabel className="ion-padding-start ion-text-wrap">
                                            <p>{ product.category.name }</p>
                                            <h4>{ product.product.name }</h4>
                                        </IonLabel>
                                    </IonItem>

                                    <IonRow className={ styles.cartQuantity }>
                                        <IonButton size="small" className={ styles.cartQuantityButton } shape="round" fill="solid" color="success" onClick={ () => addToCart(product.category.slug, product.product.id) }>+</IonButton>
                                        
                                        <IonLabel className={ styles.productCostCounter }>{ product.count }</IonLabel>

                                        <IonButton size="small" className={ styles.cartQuantityButton } shape="round" fill="solid" color="danger" onClick={ () => removeFromCart(index) }>-</IonButton>

                                        <IonLabel className={ styles.price }>{ product.displayPrice }</IonLabel>
                                    </IonRow>
                                </IonCol>
                            );
                        })}
                    </IonList>
            </IonContent>

            <IonFooter className={ styles.cartFooter }>
                <div className={ styles.cartCheckout }>
                    <IonCardSubtitle>£{ total.toFixed(2) }</IonCardSubtitle>

                    <IonButton color="dark">
                        <IonIcon icon={ checkmarkSharp } />&nbsp;Checkout
                    </IonButton>
                </div>
            </IonFooter>
        </IonPage>
    );
}

export default CartProducts;