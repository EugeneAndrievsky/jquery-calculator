import $ from "jquery";
window.$ = window.jQuery = $;

import 'jquery-ui/ui/widgets/datepicker.js';

(function($) {
    "use strict";

    $(function() {
		
		//-----
	$.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодня',
		monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
		'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
		'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
		dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
		dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		weekHeader: 'Нед',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};
	$.datepicker.setDefaults(
	  $.extend(
		{'dateFormat':'dd/mm/yy'},
		$.datepicker.regional['ru']
	  )
	);
	$('#date').datepicker();
	
	var deliveryCalculator = {
		optionLength: 0,
		
		init: function(){
			var self = this;
			$('#btnSubmit').on('click', function(e){
				e.preventDefault;
				self.getResults();
				return false;
			});
		},
		
		getResults: function(){
			var self = this;
			self.optionLength = parseInt($('#length').val()) || 0;
			//test 
			alert('Длина: ' + self.optionLength + ' см');
		}
		
	};
	
	deliveryCalculator.init();
  
  ///---
  
  
    });
}(jQuery));