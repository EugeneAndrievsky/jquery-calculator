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
		inputLength : $('#length'),
        
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
			
			self.initMap();
			
            
          
			$('#btnSubmit').on('click', function(e){
				//e.preventDefault;
				self.getResults();
				//return false;
			});
		},
		
		getResults: function(){
			var self = this;
			
			var isError = false;
			var errorMessage = 'Возникла ошибка';
		
			self.optionLength = parseInt(self.inputLength.val()) || 0;
            self.optionWidth = parseInt($('#width').val()) || 0;
            self.optionHeight = parseInt($('#height').val()) || 0;
            self.optionWeight = parseInt($('#weight').val()) || 0;
            self.optionDate = $('#date').val() || 0;
            self.optionFast = $('#fast').is(':checked');
            self.optionFrom = $('#from').val() || '';
            self.optionTo = $('#to').val() || '';
            
			if(self.optionLength < 1 || self.optionWidth < 1 || self.optionHeight < 1 || self.optionWeight < 1 ){
				isError = true;
				errorMessage = 'Введите верные параметры посылки';
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
		
		showModal: function(){
			var self = this;
			
			self.clearModal();
			
            var modalContainer = $('#resultModal');
			
            modalContainer.find('span[data-length]').html(self.optionLength);
            modalContainer.find('span[data-width]').html(self.optionWidth);
            modalContainer.find('span[data-height]').html(self.optionHeight);
            modalContainer.find('span[data-weight]').html(self.optionWeight);
            modalContainer.find('span[data-date]').html(self.optionDate);            
            modalContainer.find('span[data-from]').html(self.optionFrom);
            modalContainer.find('span[data-to]').html(self.optionTo);
            if(self.optionFast){
                modalContainer.find('span[data-fast]').html("срочная");
            } else {
                modalContainer.find('span[data-fast]').html('обычная');
            }
			
			modalContainer.modal(); //bs4 method
		},
		
		clearModal: function(){
			
            var modalContainer = $('#resultModal');
			
            modalContainer.find('span[data-length]').html('');
            modalContainer.find('span[data-width]').html('');
            modalContainer.find('span[data-height]').html(self.optionHeight);
            modalContainer.find('span[data-weight]').html(self.optionWeight);
            modalContainer.find('span[data-date]').html(self.optionDate);            
            modalContainer.find('span[data-from]').html(self.optionFrom);
            modalContainer.find('span[data-to]').html(self.optionTo);
            if(self.optionFast){
                modalContainer.find('span[data-fast]').html("срочная");
            } else {
                modalContainer.find('span[data-fast]').html('обычная');
            }
			
		},
		
		initMap: function(){
			  ymaps.ready(init);
			var myMap,
				myPlacemark;

			function init(){     
				myMap = new ymaps.Map("map", {
					center: [55.76, 37.64],
					zoom: 7
				});


				
				ymaps.geolocation.get().then(function (res) {
						var objectPos = res.geoObjects.get(0).geometry.getCoordinates();
						myMap.setCenter(objectPos, 7);
						myPlacemark = new ymaps.Placemark(objectPos);

						myMap.geoObjects.add(myPlacemark);
				}, function (e) {
					console.log(e);
				});
				
				/*
				var myGeocoder = ymaps.geocode("Москва");
				myGeocoder.then(
					function (res) {
						var objectPos = res.geoObjects.get(0).geometry.getCoordinates();
						myMap.setCenter(objectPos, 7);
						myPlacemark = new ymaps.Placemark(objectPos, { 
							hintContent: 'Москва!', 
							balloonContent: 'Столица России',
						});

						myMap.geoObjects.add(myPlacemark);
					},
					function (err) {
						alert('Ошибка');
					}
				);
				*/
			}
		}
		
	};
	
	deliveryCalculator.init();
  
  ///-----
  
  
    });
}(jQuery));