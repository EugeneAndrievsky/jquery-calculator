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
            
            self.Map.init();

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
            self.optionFrom = $('#placeFrom').val() || '';
            self.optionTo = $('#placeTo').val() || '';
            
            if(self.optionLength < 1 || self.optionWidth < 1 || self.optionHeight < 1 || self.optionWeight < 1) {
                isError = true;
                errorMessage = 'Введите правильные параметры посылки';
            }
            
            if(self.optionFrom.length <= 1  || self.optionTo.length <= 1){
				isError = true;
				errorMessage = 'Для получения рассчета введите точку отправления и точку получения';
			}			
			
			if(isError){
                swal({
                  title: '',
                  text: errorMessage,
                  icon: 'warning',
                  button: 'Ой!',
                });
				return false;
			}
            
            self.calcPrice();
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
            modal.find('.input-from').html(
                self.optionFrom.charAt(0).toUpperCase() + self.optionFrom.substr(1).toLowerCase()
            );
            modal.find('.input-to').html(
                self.optionTo.charAt(0).toUpperCase() + self.optionTo.substr(1).toLowerCase()
            );
            
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
        
        calcPrice: function() {
            var routeLengthKm = parseInt(deliveryCalculator.Map.routeLength / 1000);
            var weightKg = deliveryCalculator.optionWeight / 1000;
            var fastCoeff =  function() {
                if(deliveryCalculator.optionFast) {
                    return 1.3;
                } else {
                    return 1;
                }                
            };
            var routeCoeff = 5; // 5rub per 1kg*km 
            
            var routePrice = parseInt(routeLengthKm * weightKg * fastCoeff() * routeCoeff);
            console.log('Total price is ' + routeLengthKm +  ' km * ' + weightKg + ' kg * ' + fastCoeff() +  ' * ' + routeCoeff + ' = ' + routePrice);
            
            $('.output-distance').text(routeLengthKm);
            $('.output-price').text(routePrice);
        },
        
        Map: {
            myMap: null,
			placeFrom: '',
			placeTo: '',
            geoCenter: [0,0],
			routeLength: 0,
            
            init: function() {
                ymaps.ready(function(){
                    deliveryCalculator.Map.myMap = new ymaps.Map("map", {
                        center: [55.76, 37.64],
                        zoom: 6
                    });
                });
                
                deliveryCalculator.Map.addEventListeners();
            },
            
            addEventListeners: function(){
				$('#placeFrom').on('change',function(e){
					deliveryCalculator.Map.placeFrom = $(this).val();
					deliveryCalculator.Map.addMarker(deliveryCalculator.Map.placeFrom, 'Точка отправления', 'dist/img/icon-map-3.svg');
					deliveryCalculator.Map.checkForPlaces();
				});
				$('#placeTo').on('change',function(e){
					deliveryCalculator.Map.placeTo = $(this).val();
					deliveryCalculator.Map.addMarker(deliveryCalculator.Map.placeTo, 'Точка назначения', 'dist/img/icon-map-1.svg');
					deliveryCalculator.Map.checkForPlaces();
				});
			},
            
            addMarker: function(place, message, icon) {
                var geo;
                
                geo = ymaps.geocode(place);                
                geo.then(
                    function (res) {                        
						var mapMarker;
                        var objectPos = res.geoObjects.get(0).geometry.getCoordinates();
//                        geoCenter[0] += objectPos[0]/2;
//                        geoCenter[1] += objectPos[1]/2;                        
                        console.log('Координаты объекта ' + place + ': ' + objectPos);
                        deliveryCalculator.Map.myMap.setCenter(objectPos, 7);

                        mapMarker = new ymaps.Placemark(objectPos, {
                            hintContent: place,
                            balloonContent: message
                        }, {
                            iconLayout: 'default#image',                
                            iconImageHref: icon,
                            iconImageSize: [30, 48],
                            iconImageOffset: [-10, -46]
                        });
                        deliveryCalculator.Map.myMap.geoObjects.add(mapMarker);
//                        deliveryCalculator.Map.myMap.setCenter(geoCenter, 7); 
//                        console.log('Координаты центра: ' + geoCenter);
                    },
                    function (err) {
                        alert('Ошибка');
                    }
                );
            },
            
            checkForPlaces: function() {
                if(deliveryCalculator.Map.placeFrom && deliveryCalculator.Map.placeTo) {
                    deliveryCalculator.Map.buildRoute();
                }
            },
            
            buildRoute: function() {
                
                ymaps.route([deliveryCalculator.Map.placeFrom, deliveryCalculator.Map.placeTo]).then(
                    function (route) {
                        route.getPaths().options.set({
                            strokeColor: '0000ffff',
                            strokeWidth: 5,
                            opacity: 0.7
                        });
                        deliveryCalculator.Map.myMap.geoObjects.add(route.getPaths());
                        
                        deliveryCalculator.Map.routeLength = route.getLength();
                        console.log(deliveryCalculator.Map.routeLength);
                    },
                    function (error) {
                        alert('Возникла ошибка: ' + error.message);
                    }
                );
            }
        }
	};
	
	deliveryCalculator.init();
  
  ///-----
  
  
    });
}(jQuery));