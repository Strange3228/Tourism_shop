
//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const buyBtn = document.querySelector('.buy-button');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
const slider1 = document.querySelector('.owl_carousel_1');
const slider2 = document.querySelector('.owl_carousel_2');
const slider3 = document.querySelector('.owl_carousel_3');

// cart
let cart = []
// buttons
let buttonsDOM = []

//getting products
/**
* Class for gerring products from the JSON and make object with product information
*/
class Products{
    /**
     * Function for getting products from JSON file
     */
    async getProducts(){
        try {
            let result  = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {title, price, category} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, category, price, id, image};
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}
//user interface - display products
/**
 * Сlass for working with user interface. Adding elements to the DOM. Make posible to add elements to the cart etc.
 */
class UI {
    /**
     * Function which adding products to the DOM(checking category and add to different places)
     * @param {array} products Array of objects which include all information about product 
     */
    displayProducts(products){
        let result = '';
        /*ACCESSORIES*/
        products.forEach(product => {
            if(product.category === "Accessories")
            {
            result += `
            <!--Single product-->
            <div class="product item">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </div>
            <!--end of single product-->
            `;
            }
        });
        slider1.innerHTML = result;
        result = '';
        $('.owl_carousel_1').owlCarousel({
            loop:true,
            margin:10,
            nav:false,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                },
                1000:{
                    items:3
                }
            }
        });
        /*BAGS AND HOLDERS*/
        products.forEach(product => {
            if(product.category === "Bags and holders")
            {
            result += `
            <!--Single product-->
            <div class="product item">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </div>
            <!--end of single product-->
            `;
            }
        });
        slider2.innerHTML = result;
        result= '';
        $('.owl_carousel_2').owlCarousel({
            loop:true,
            margin:10,
            nav:false,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                },
                1000:{
                    items:3
                }
            }
        });
        /*SECURITY*/
        products.forEach(product => {
            if(product.category === "Secuirity")
            {
            result += `
            <!--Single product-->
            <div class="product item">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </div>
            <!--end of single product-->
            `;
            }
        });
        slider3.innerHTML = result;
        $('.owl_carousel_3').owlCarousel({
            loop:true,
            margin:10,
            nav:false,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                },
                1000:{
                    items:3
                }
            }
        });
    }
    /**
     * Function that make real to add products to the cart by clicking on add to cart button
     */
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.innerText = "In Cart";
                button.disabled = true;
            }
            button.addEventListener('click', (event) => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product from products
                let cartItem = {...Storage.getProduct(id), amount:1};        
                // add product to the cart
                cart = [...cart,cartItem];
                // save cart in local storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart);
                // display cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();
            });
            
        });   
    }
    /**
     * Showing us total of products in cart and their total price
     */
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    /**
     * Adding products to the cart DOM
     * @param {object} item 
     */
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src=${item.image} alt="product">
            <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `;
        cartContent.appendChild(div);
    }
    
    /**
     * Adding classes to the cart for make it visible
     */
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    };

    /**
     * Function that makes posible to save changes when we restaring the page
     */
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    /**
     * Function that populate cart
     * @param {array} cart 
     */
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }

    /**
     * By clicking on close cart btutton makes cart unvisible
     */
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    /**
     * Presents all cart logic
     */
    cartLogic(){
        //clear cart button
        clearCartBtn.addEventListener("click", ()=>{
            this.clearCart();
        });
        buyBtn.addEventListener("click", () => {
            this.clearCart();
            $.notify("Come to the office for your Equipment", "success");
        });
        //cart functionality
        cartContent.addEventListener('click', event => {
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
    }

    /**
     * Function for clearing cart by pressing on button
     */
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }

    /**
     * Functrion for removing element from cart by clicking on button 
     * @param {string} id 
     */
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i> add to cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
//local storage
/**
* Class which save all information to local storage. Local storage allows us to refresh page and not lose our data
*/
class Storage{
    /**
     * Save products to our local storage
     * @param {array} products 
     */
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    /**
     * Parsing json file
     * @param {string} id 
     */
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    /**
     * Save cart to local storage
     * @param {array} cart 
     */
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    /**
     * Getting cart 
     */
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}
//
document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupAPP();
    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });
});