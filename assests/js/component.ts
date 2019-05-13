
import {Product, OrderItemsProps} from './interface';
import products from './data';

export class OrderItems {
    elem;
    jsonData: Product[];
    orderTable;
    totalSelector;
    vatSelector;
    subtotalSelector;
    emptyProduct;
    inpConfig: {
        min: 0,
        max: 10
    };
    constructor(obj) {
        this.elem = obj;
        this.jsonData = products;
        this.orderTable = this.elem.find('.revo-basket__order-body')
        this.totalSelector = this.elem.find('.revo-basket__total__price');
        this.vatSelector = this.elem.find('.revo-basket__vat__price');
        this.subtotalSelector = this.elem.find('.revo-basket__subtotal__price');
        this.emptyProduct = this.elem.siblings('.revo-basket__empty');
    }
    init() {
        if(this.jsonData.length) {
            this.orderTable.html(this.renderOrders());
            this.updateTotals();
            this.toggleTable(true);
            this.orderTable.find('.my-qty__control > div').click(this.updateProduct.bind(this));
            this.orderTable.find('.my-qty__inp').keyup(this.minmax.bind(this));
            this.orderTable.find('.fa-trash').click(this.deleteProduct.bind(this));
            this.elem.find('.revo-basket__button button').click(this.postData.bind(this));
        }
    }
    minmax(event) {
        const elem = event.currentTarget;
        let rValue = elem.value;
        if(parseInt(elem.value) < this.inpConfig.min || isNaN(parseInt(elem.value))) 
            rValue = this.inpConfig.min; 
        else if(parseInt(elem.value) > this.inpConfig.max) 
            rValue = this.inpConfig.max; 
        this.updateProductChange(event);
        return rValue;
    }
    renderOrders() {
        const data = this.jsonData;
        const productHTML = (data.length && data.map(product => {
            return `<div class="row" role="row" data-id=${product.id}>
                        <div class="col-md-6" role="rowheader">
                            <span class="d-inline d-md-none mobile-head">Product: </span>${product.name}
                        </div>
                        <div class="col-md-2" role="cell">
                            <span class="d-inline d-md-none mobile-head">Price: </span>&pound; ${product.price.toFixed(2)}
                        </div>
                        <div class="col-md-2" role="cell">
                            <span class="d-inline d-md-none mobile-head">Qty: </span>
                            <div class="my-qty__wrap">
                                <input type="text" class="form-control my-qty__inp" value=${product.quantity} />
                                <div class="my-qty__control">
                                    <div aria-label="increment product quantity" class="my-qty__control-inc"><i class="fa fa-plus"></i></div>
                                    <div aria-label="decrement product quantity" class="my-qty__control-dec"><i class="fa fa-minus"></i></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <span class="d-inline d-md-none mobile-head">Cost: </span>
                            <span class="total-product-cost">&pound; ${(product.price * product.quantity).toFixed(2)}</span>
                        </div>
                        <button class="btn btn-link fa fa-trash" aria-label=${'Delete' + product.name + 'product'}></button>
                    </div>`;
        })) || '';
        return productHTML;
    }
    toggleTable(flag:Boolean) {
        if(flag) {
            this.elem.removeClass('d-none');
            this.emptyProduct.addClass('d-none');
        } else {
            this.elem.addClass('d-none');
            this.emptyProduct.removeClass('d-none') 
        }
    }
    setPriceHTML(elem, amount) {
        elem.html('&pound; ' + amount);
    }
    updateProductChange(event) {
        const elem = jQuery(event.currentTarget);
        const inp = elem;
        const prodWrapper = elem.closest('[data-id]');
        const prodId = prodWrapper.attr('data-id');
        // @ts-ignore
        let currentQty = parseInt( inp.val(), 10);
        if(currentQty <= 10 && currentQty >= 0) {
            const getProductIndex = this.jsonData.findIndex(prod => prod.id === prodId);
            this.jsonData[getProductIndex].quantity = currentQty;
            prodWrapper.find('.total-product-cost').html(
                '&pound; ' + this.jsonData[getProductIndex].price * this.jsonData[getProductIndex].quantity
            );
            this.updateTotals();
        }
    }
    updateProduct(event) {
        const elem = jQuery(event.currentTarget);
        const inp = elem.closest('.my-qty__control').siblings('.my-qty__inp');
        const prodWrapper = elem.closest('[data-id]');
        const prodId = prodWrapper.attr('data-id');
        // @ts-ignore
        let currentQty = parseInt( inp.val(), 10);
        if(currentQty <= 10 && currentQty >= 0) {
            if(elem.hasClass('my-qty__control-inc') && currentQty < 10) {
                currentQty +=1;
            } else if(elem.hasClass('my-qty__control-dec') && currentQty > 0){
                currentQty -=1;
            }
            const getProductIndex = this.jsonData.findIndex(prod => prod.id === prodId);
            inp.val(currentQty);
            this.jsonData[getProductIndex].quantity = currentQty;
            prodWrapper.find('.total-product-cost').html(
                '&pound; ' + this.jsonData[getProductIndex].price * this.jsonData[getProductIndex].quantity
            );
            this.updateTotals();
        }
    }
    updateTotals() {
        let subtotal = 0;
        this.jsonData.forEach(prod => {
            subtotal += (prod.price * prod.quantity)
        });
        const vat = (subtotal * 20)/100;
        const dataMapper = {
            total: (subtotal + vat).toFixed(2),
            subtotal: subtotal.toFixed(2),
            vat: vat.toFixed(2),
        };
        const _this = this;
        Object.keys(dataMapper).forEach(data => {
            _this.setPriceHTML(_this[data+'Selector'], dataMapper[data])
        })
    }
    deleteProduct(event) {
        const elem = event.target;
        const prodWrapper = elem.closest('[data-id]');
        const prodId = prodWrapper.dataset.id;
        this.jsonData = this.jsonData.filter(prod => prod.id !== prodId);
        prodWrapper.remove();
        this.jsonData.length ? this.updateTotals() : this.toggleTable(false);
    }
    postData() {
        try {
            fetch('/', {
                method: 'POST',
                body: JSON.stringify(this.jsonData)
            }).then(resp => {
                alert("Data Submitted Successfully");
                this.jsonData = [];
                this.toggleTable(false);
            }).catch(err => {
               console.log(err);
            });
        } catch(e) {
            console.log(e);
        }
    }
}   