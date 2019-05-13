'use strict';
import * as $ from "jquery";
import '../styles/style.scss';
import { OrderItems } from './component';

$(document).ready(function() {
	let component = new OrderItems($(".revo-basket-container"));
	  component.init();
});
