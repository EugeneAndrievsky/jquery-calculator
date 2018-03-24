//import $ from "jquery";
//window.$ = window.jQuery = $;

import 'jquery-ui/ui/widgets/datepicker.js';
//import 'magnific-popup/dist/jquery.magnific-popup.min.js';

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
        
        init: function(){
            
			var self = this;
            
            self.initMap();
            
			$('#btnSubmit')
                .on('click', function(e){
                    e.preventDefault;
                    self.getResults();
                    return false;
			    })                
                .removeAttr('disabled');
        },
		
		getResults: function(){
            
            var self = this;
            var isError = false;
            var errorMessage = 'Возникла ошибка';
            
            self.clearModal();            
			
			self.optionLength = parseInt($('#length').val()) || 0;
            self.optionWidth = parseInt($('#width').val()) || 0;
            self.optionHeight = parseInt($('#height').val()) || 0;
            self.optionWeight = parseInt($('#weight').val()) || 0;
            self.optionDate = $('#date').val() || 0;
            self.optionFast = $('#fast').is(':checked');
            self.optionFrom = $('#from').val() || '';
            self.optionTo = $('#to').val() || '';
            
            if(self.optionLength < 1 || self.optionWidth < 1 || self.optionHeight < 1 || self.optionWeight < 1) {
                isError = true;
                errorMessage = 'Введите правильные параметры посылки';
            }
            
            if(self.optionFrom.length <= 1  || self.optionTo.length <= 1){
				isError = true;
				errorMessage = 'Для получения рассчета введите точку отправления и точку получения';
			}			
			
			if(isError){
				alert(errorMessage);
				return false;
			}            
            
			self.showModal();            
        },
        
        openPopup: function() {
            
            $.magnificPopup.open({
                items: {
                  src: '#modal-window',
                  type: 'inline'
                },
                closeBtnInside: true
            });
        },
        
        showModal: function(){
            
            var self = this;
            var modal = $('#modal-window');
            
            modal.find('.input-length').html(self.optionLength);
            modal.find('.input-width').html(self.optionWidth);
            modal.find('.input-height').html(self.optionHeight);
            modal.find('.input-weight').html(self.optionWeight);
            modal.find('.input-from').html(self.optionFrom);
            modal.find('.input-to').html(self.optionTo);
            
            if(self.optionFast){
                modal.find('.input-fast').html("срочная");
            } else {
                modal.find('.input-fast').html('обычная');
            }
            
            if(self.optionDate){
                modal.find('.modal-date').html('Забрать: <span>' + self.optionDate + 'г.</span><br>')
            }
            
            self.openPopup();            
		}, 
        
        clearModal: function(){
            
            var self = this;
			self.optionLength = '';
            self.optionWidth = '';
            self.optionHeight = '';
            self.optionWeight = '';
            self.optionDate = '';
            self.optionFast = '';
            self.optionFrom = '';
            self.optionTo = '';
            $('#modal-window').find('.modal-date').html('');            
        },
        
        initMap: function(){}
		
	};
	
	deliveryCalculator.init();
  
  ///-----
  
  
    });
}(jQuery));