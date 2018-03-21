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
		{'dateFormat':'dd.mm.yy'},
		$.datepicker.regional['ru']
	  )
	);
	$('#date').datepicker();
	
	var deliveryCalculator = {
        
		optionLength: 0,
        optionWidth: 0,
        optionHeight: 0,        
        optionWeight: 0,
        optionDate: 0,
        optionFast: false,
        optionFrom: '',
        optionTo: '',
		
		init: function(){
			var self = this;
			$('#btnSubmit').on('click', function(e){
				//e.preventDefault;
				self.getResults();
				//return false;
			});
		},
		
		getResults: function(){
			var self = this;
			self.optionLength = parseInt($('#length').val()) || 0;
            self.optionWidth = parseInt($('#width').val()) || 0;
            self.optionHeight = parseInt($('#height').val()) || 0;
            self.optionWeight = parseInt($('#weight').val()) || 0;
            self.optionDate = $('#date').val() || 0;
            self.optionFast = $('#fast').is(':checked');
            self.optionFrom = $('#from').val() || '';
            self.optionTo = $('#to').val() || '';
            
            var modal = $('.modal');
            modal.find('span[data-length]').html(self.optionLength);
            modal.find('span[data-width]').html(self.optionWidth);
            modal.find('span[data-height]').html(self.optionHeight);
            modal.find('span[data-weight]').html(self.optionWeight);
            modal.find('span[data-date]').html(self.optionDate);            
            modal.find('span[data-from]').html(self.optionFrom);
            modal.find('span[data-to]').html(self.optionTo);
            if(self.optionFast){
                modal.find('span[data-fast]').html("срочная");
            } else {
                modal.find('span[data-fast]').html('обычная');
            }
		}
		
	};
	
	deliveryCalculator.init();
  
  ///-----
  
  
    });
}(jQuery));