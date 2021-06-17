/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css } from 'lit';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The name to say "Hello" to.
       */
      data: { type: Array },
      client: { type: String },
      delivery: { type: Object },
      cashiers: { type: Object },
      icecreams: { type: Object },
      showDetail: { type: Boolean },
      showOrder: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.data = [];
    this.client = '';
    this.showDetail = true;
    this.showOrder = true;
    this.deliver = '';
    this.icecream = '';
    this.filter = '';
    this.delivery = [];
    this.cashiers = [];
    this.icecreams = [];
    this.filterClient = '';
    this.icecreamClient = '';
    this.nameClient = '';
    this.lastnameClient = '';
    this.adressClient = '';
    this.phoneClient = '';
    this.check = '';
    this.idList;
    this.orderDetail='';
    this.getAllDeliverys();
    this.getCashiers();
    this.getIcecream();

  }
  getAllDeliverys() {
    fetch("http://localhost:8080/delivery/getdelivery").then(res => res.json()).then(d =>
      this.delivery = d);
  }

  getCashiers() {
    fetch("http://localhost:8080/cashier/getcashier").then(res => res.json()).then(c =>
      this.cashiers = c);;
  }
  getIcecream() {
    fetch("http://localhost:8080/icecream/geticecream").then(res => res.json()).then(i => this.icecreams = i);
  }

  render() {

    return html`
    <div>
      <input placeholder='filtrado' name='filtler_client' .value='${this.filterClient}'  @input="${(e) => this.filterClient = e.target.value}" >
      <button @click='${this.filterClients}'>filtrar cliente</button>
      </div>
     
      ${this.showDetail ? html`
      <h2>Bienvenido${this.client}</h2>
      <label>Seleccione el repartidor </label>
      <select name='list_delivery' @change='${(r) => this.deliver = r.target.value}' .value='${this.deliver}'>
      <option selected>Seleccione</option> ${this.delivery.map(item => html`<option value='${item.idDelivery}'>${item.name}</option>`)}
      </select>
      <br>
      <br>
      <label>Seleccione el cajero... </label>
      <select name='list_cashier'  @change='${(ca) => this.check = ca.target.value}' .value='${this.check}'>
      <option selected>Seleccione</option> ${this.cashiers.map(item => html`<option value='${item.idCashier}'>${item.name}</option>`)}
      </select>
      <button @click='${this.listOrder}'>Agregar nueva orden</button> 
            ` : html`
      <div >
          <label>Nombre del cliente</label>
        <input placeholder='nombre' name='name_client' .value='${this.nameClient}'  @input="${(e) => this.nameClient = e.target.value}" >
          <label>Apellidos del cliente</label>
          <input placeholder='apellido' name='lastname_client' .value='${this.lastnameClient}'  @input="${(e) => this.lastnameClient = e.target.value}" >
          <label>Direcccion del cliente</label>
          <input placeholder='Direccion' name='adress_client' .value='${this.adressClient}'  @input="${(e) => this.adressClient = e.target.value}" >
          <label>Telefono del cliente</label>
          <input placeholder='Telefono' name='phone_client' .value='${this.phoneClient}'  @input="${(p) => this.phoneClient = p.target.value}" >
        <button @click='${this.createCustomer}'>Agregar nuevo cliente</button>
        </form>
      </div>
      `}
      ${this.showOrder ? html `` : html `
      <input placeholder='detalle de el pedido' name='order' .value='${this.orderDetail}'  @input="${(e) => this.orderDetail = e.target.value}" >
      <label>Seleccione el tipo de helado... </label>
      <select name='list_icecream'  @change='${(h) => this.icecream = h.target.value}' .value='${this.icecream}'>
      <option selected>Seleccione</option>${this.icecreams.map(item => html`<option value='${item.idIcecream}'>${item.icecreamDescription}</option>`)}
      </select>
      <button @click='${this.createOrder}'>Agregar a la orden</button>
      <h2>Si desea agregar mas helados a su orden por favor seleccione el helado y pulse agregar a la orden</h2>
      <button @click='${this.orders}'>ver las ordenes que poseo</button>
      <table>
     <tr>

<td class="tabla">Detalle del pedido</td>
<td class="tabla">Descripcion del helado</td>

    </tr>

    ${this.data.map(item => html`<tr>
     <td> ${item.orderDescription} </td> 
     <td> ${item.icecreamIdIcecream.icecreamDescription} </td> 
     </tr>`)}
 </table>
      `}

      <br>
     
      
    `;
  }

  listOrder() {
    //console.log(this.check);
    //console.log(this.deliver);
    //console.log(this.filter);
    //console.log(this.icecream);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch("http://localhost:8080/listorder/neworderdetail/"+ this.check+"/"+ this.deliver+"/"+ this.filter,{method: 'POST',headers: myHeaders})
    .then(res => res.json()).then(list => {
      this.idList=list.idListOrder; 
      this.showOrder= false;
    }).catch(e => {
      console.error(e);
      this.showOrder = true;
    });
  }

  filterClients() {
    //console.log(this.filterClient)
    fetch("http://localhost:8080/client/phone/" + this.filterClient)
    .then(res => res.json()).then(filter => {
      //console.log(filter.name);
      this.client=filter.name;
      this.filter=filter.idClient
      //console.log(this.client);
      this.showDetail = true;
    }).catch(e => {
      console.error(e);
      this.showDetail = false;
    });
  }

  createCustomer() {
    /* console.log(this.nameClient);
     console.log(this.lastnameClient);
     console.log(this.phoneClient);
     console.log(this.adressClient);*/
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch("http://localhost:8080/client/createclient", {
      method: 'POST', body:
        JSON.stringify({
          "name": this.nameClient,
          "lastame": this.lastnameClient,
          "adress": this.adressClient,
          "phone": this.phoneClient
        }), headers: myHeaders
    }).then(() => alert("Se agrego correctamente el cliente"))
  }
  createOrder() {
   // console.log(this.icecream);
    //console.log(this.idList);
   // console.log(this.orderDetail);
   let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch("http://localhost:8080/orderdetail/newlistorder/"+ this.orderDetail+"/"+ this.icecream+"/"+ this.idList,{method: 'POST',headers: myHeaders})
    .then(res => res.json()).then(detail => {
      console.log(detail);
    });
  }
  orders(){
    fetch("http://localhost:8080/orderdetail/orderclient/"+this.filter).then(res => res.json()).then(data => {
      if (data.lenght != 0) {
       this.data=data;  
      }else {
        window.alert("No existe ordenes")
      }
    })
  }
}
window.customElements.define('my-element', MyElement);
