import $ from "jquery";
window.$ = window.jQuery = $;

import swal from 'sweetalert'; 
window.swal = swal;

import 'jquery-ui/ui/widgets/datepicker.js';
import 'magnific-popup/dist/jquery.magnific-popup.min.js';

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
            
//            self.initMap();
            
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
            
//            if(self.optionLength < 1 || self.optionWidth < 1 || self.optionHeight < 1 || self.optionWeight < 1) {
//                isError = true;
//                errorMessage = 'Введите правильные параметры посылки';
//            }
//            
//            if(self.optionFrom.length <= 1  || self.optionTo.length <= 1){
//				isError = true;
//				errorMessage = 'Для получения рассчета введите точку отправления и точку получения';
//			}			
//			
//			if(isError){
//                swal({
//                  title: '',
//                  text: errorMessage,
//                  icon: 'warning',
//                  button: 'Ой!',
//                });
//				return false;
//			}            
            
			self.showModal();
            self.buildPath();
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
        
        /*initMap: function(){
            ymaps.ready(init);
            var myMap;
            var myPlacemark;
            var myGeocoder;
            
            function init() {
                myMap = new ymaps.Map("map", {
                    center: [55.76, 37.64],
                    zoom: 7
                });    

                myGeocoder = ymaps.geocode("Москва");
                myGeocoder.then(
                    function (res) {
                        var objectPos = res.geoObjects.get(0).geometry.getCoordinates();
//                        alert('Координаты объекта: ' + objectPos);
//                        console.log('Координаты объекта: ' + objectPos);
//                        console.log(res.geoObjects.get(0).geometry.getCoordinates());

                        myMap.setCenter(objectPos, 7);

                        myPlacemark1 = new ymaps.Placemark(myMap.getCenter(), {
                            hintContent: 'Москва!',
                            balloonContent: 'Столица России'
                        }, {
                            iconLayout: 'default#image',                
                            iconImageHref: 'dist/img/icon-map-1.svg',
                            iconImageSize: [48, 48],
                            iconImageOffset: [-24, -48]
                        });
                        myMap.geoObjects.add(myPlacemark1); 
                    },
                    function (err) {
                        alert('Ошибка');
                    }
                );
            };
        },*/
        
        buildPath: function() {
            ymaps.ready(init);
            var myMap;
            var markFrom;
            var markTo;
            var geoFrom;
            var geoTo;
            var geoCenter = [0,0];
            var geoCenterPoint;
            var self = this;
            
            function init() {
                myMap = new ymaps.Map("map", {
                    center: [55.76, 37.64],
                    zoom: 6
                }); 

                geoFrom = ymaps.geocode(self.optionFrom);
                geoFrom.then(
                    function (res) {
                        var objectPos = res.geoObjects.get(0).geometry.getCoordinates();
                        geoCenter[0] += objectPos[0]/2;
                        geoCenter[1] += objectPos[1]/2;
                        
                        console.log('Координаты первого объекта ' + self.optionFrom + ': ' + objectPos); 
                        
                        markFrom = new ymaps.Placemark(objectPos, {
                            hintContent: self.optionFrom,
                            balloonContent: 'Точка отправления'
                        }, {
                            iconLayout: 'default#image',                
                            iconImageHref: 'dist/img/icon-map-3.svg',
                            iconImageSize: [48, 48],
                            iconImageOffset: [-24, -48]
                        });
                        myMap.geoObjects.add(markFrom);
                    },
                    function (err) {
                        alert('Ошибка');
                    }
                );
                
                geoTo = ymaps.geocode(self.optionTo);
                geoTo.then(
                    function (res) {
                        var objectPos = res.geoObjects.get(0).geometry.getCoordinates();
                        geoCenter[0] += objectPos[0]/2;
                        geoCenter[1] += objectPos[1]/2;
                        
                        console.log('Координаты второго объекта ' + self.optionTo + ': ' + objectPos);

                        markTo = new ymaps.Placemark(objectPos, {
                            hintContent: self.optionTo,
                            balloonContent: 'Точка назначения'
                        }, {
                            iconLayout: 'default#image',                
                            iconImageHref: 'dist/img/icon-map-1.svg',
                            iconImageSize: [48, 48],
                            iconImageOffset: [-24, -48]
                        });
                        myMap.geoObjects.add(markTo);
                        
//                        myMap.setCenter(geoCenter, 7);                        
                        console.log('Координаты центра: ' + geoCenter);
                        myMap.setCenter(objectPos, 6);
                    },
                    function (err) {
                        alert('Ошибка');
                    }
                );
                
                ymaps.route([self.optionFrom, self.optionTo]).then(
                    function (route) {
                        myMap.geoObjects.add(route);                        
                        var length = route.getLength();
                        console.log(length);

                    },
                    function (error) {
                        alert('Возникла ошибка: ' + error.message);
                    }
                );
                
                
            };
            
            
        }
		
	};
	
	deliveryCalculator.init();
  
  ///-----
  
  
    });
}(jQuery));