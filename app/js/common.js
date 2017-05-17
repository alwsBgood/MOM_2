if (localStorage.name && localStorage.email && localStorage.phone)  {
  // запись сохраненных данных сразу в поля, если надо
  $('input[name="name"]').val(localStorage.name);
  $('input[type="email"]').val(localStorage.email);
  $('input[type="tel"]').val(localStorage.phone);
}

//file format check
$("#upload_file, #upload_file_2").change(function () {
  var fileExtension = ['doc', 'docx', 'pdf'];

  if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
    $("[name=send]").attr('disabled', true);
    alert("Файл должен быть в формате: "+fileExtension.join(', '));
  } else if (this.files[0].size > 15728640) {
      $("[name=send]").attr('disabled', true);
      alert("Размер файла не должен превышать 15Mb");
  } else {
    $("[name=send]").attr('disabled', false);
  }
});

$(function() {
  $("[name=send]").click(function (e) {
   var btn = $(this);
   var form = $(this).closest('form');

   $(":input.error").removeClass('error');
   $(".allert").remove();

   var error;
   var ref = btn.closest('form').find('[required]');
   var loc = ymaps.geolocation.city+', '+ymaps.geolocation.region+', '+ymaps.geolocation.country;
   $('[name=city]').val(loc);
   var msg = btn.closest('form').find('input, textarea, select');
   var short_msg = btn.closest('form').find('[name=project_name], [name=admin_email], [name=form_subject], [name=city], [name=page_url], [name=user_agent], [type="text"], [type="email"], [type="tel"], [type="file"]');
   var msg = btn.closest('form').find('input, textarea, select');
   var send_btn = btn.closest('form').find('[name=send]');
   var send_adress = btn.closest('form').find('[name=send_adress]').val();
   var send_options = btn.closest('form').find('[name=campaign_token]');;
   var formType = btn.closest('form').find('[name=form_type]').val();
   var redirect = btn.closest('form').find('[name=redirect]').val();
   var goal = btn.closest('form').find('[name=goal]').val();
   var alertImage = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 286.1 286.1"><path d="M143 0C64 0 0 64 0 143c0 79 64 143 143 143 79 0 143-64 143-143C286.1 64 222 0 143 0zM143 259.2c-64.2 0-116.2-52-116.2-116.2S78.8 26.8 143 26.8s116.2 52 116.2 116.2S207.2 259.2 143 259.2zM143 62.7c-10.2 0-18 5.3-18 14v79.2c0 8.6 7.8 14 18 14 10 0 18-5.6 18-14V76.7C161 68.3 153 62.7 143 62.7zM143 187.7c-9.8 0-17.9 8-17.9 17.9 0 9.8 8 17.8 17.9 17.8s17.8-8 17.8-17.8C160.9 195.7 152.9 187.7 143 187.7z" fill="#E2574C"/></svg>';

   localStorage.name = form.find('input[name="name"]').val();
   localStorage.email = form.find('input[type="email"]').val();
   localStorage.phone = form.find('input[type="tel"]').val();


   $(ref).each(function() {
    if ($(this).val() == '') {
      var errorfield = $(this);
      $(this).addClass('error').parent('.field').append('<div class="allert"><span>Заполните это поле</span>' + alertImage + '</div>');
      error = 1;
      $(":input.error:first").focus();
      return;
    } else {
      var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
      if ($(this).attr("type") == 'email') {
        if (!pattern.test($(this).val())) {
          $("[name=email]").val('');
          $(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный e-mail</span>' + alertImage + '</div>');
          error = 1;
          $(":input.error:first").focus();
        }
      }
      var patterntel = /^()[- +()0-9]{9,18}/i;
      if ($(this).attr("type") == 'tel') {
        if (!patterntel.test($(this).val())) {
          $("[name=phone]").val('');
          $(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите номер телефона в формате +3809999999</span>' + alertImage + '</div>');
          error = 1;
          $(":input.error:first").focus();
        }
      }
    }
  });

   if (!(error == 1)) {
    $(send_btn).each(function() {
      $(this).attr('disabled', true);
    });
     // Отправка в Google sheets
    //  $.ajax({
    //   type: 'POST',
    //   url: '',
    //   dataType: 'json',
    //   data: msg,
    // });
    // Отправка на почту
    $.ajax({
      type: 'POST',
      url: '/mail.php',
      data: short_msg,
      success: function() {
        setTimeout(function() {
          $("[name=send]").removeAttr("disabled");
        }, 1000);
        $('div.md-show').removeClass('md-show');
        // dataLayer.push({
        //   'form_type': formType,
        //   'event': "form_submit"
        // });
          // Отправка в базу данных
        //   $.ajax({
        //    type: 'POST',
        //    url: 'db/registration.php',
        //    dataType: 'json',
        //    data: form.serialize(),
        //    success: function(response) {
        //      console.info(response);
        //      console.log(form.serialize());
        //      if (response.status == 'success') {
        //       $('form').trigger("reset");
        //       window.location.href = '/success';
        //     }
        //   }
        // });
      },
      error: function(xhr, str) {
        console.log("Erorr")
      }
    });

  }
  return false;
})
});

 // Smooth scroll to anchor

 $('.scroll').click(function(){
  $('html, body').animate({
    scrollTop: $( $.attr(this, 'href') ).offset().top
  }, 1000);
  return false;
});

//  INPUT TEL MASK

jQuery(function($){
 $("input[type='tel']").mask("+38 (099) 999-9999");
});



// Scroll BAR

$(window).scroll(function() {
  // calculate the percentage the user has scrolled down the page
  var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());

  $('.bar-long').css('width', scrollPercent +"%"  );

});


//YOUTUBE

$(function() {
  $(".youtube").each(function() {
    $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

    $(this).append($('<div/>', {'class': 'play'}));

    $(document).delegate('#'+this.id, 'click', function() {
      var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
      if ($(this).data('params')) iframe_url+='&'+$(this).data('params');

      var iframe = $('<iframe/>', {'frameborder': '0', 'src': iframe_url, 'width': $(this).width(), 'height': $(this).height() })

      $(this).replaceWith(iframe);
    });
  });
});

//  UP BUTTON

$( document ).ready(function() {
  $('#scrollup img').mouseover( function(){
    $( this ).animate({opacity: 0.65},100);
  }).mouseout( function(){
    $( this ).animate({opacity: 1},100);
  });

  $(window).scroll(function(){
    if ( $(document).scrollTop() > 0 ) {
      $('#scrollup').fadeIn('slow');
    } else {
      $('#scrollup').fadeOut('slow');
    }
  });

  $('#scrollup').click(function() {
    $('body,html').animate({scrollTop:0},1000);
  });
});

// PREVENT SCROLLING

$('.md-trigger').click(function() {
  $("body").addClass('unscroll');
});

$('.md-close').click(function() {
  $("body").removeClass('unscroll');
});

$('.md-overlay').click(function() {
  $("body").removeClass('unscroll');
});


//Sliders

// $('.slider_event_mu-photo-1').slick({
//   slidesToShow: 1,
//   waitForAnimate: false,
//   dots: false,
//   arrows: true,
//   infinite: true,
//   slidesToScroll: 1,
//   fade: true,
// });

// $('.slider_event_mu-photo-2').slick({
//   slidesToShow: 1,
//   waitForAnimate: false,
//   dots: false,
//   arrows: true,
//   infinite: true,
//   slidesToScroll: 1,
//   fade: true,
// });

// $('.slider_event_mu-photo-3').slick({
//   slidesToShow: 1,
//   waitForAnimate: false,
//   dots: false,
//   arrows: true,
//   infinite: true,
//   slidesToScroll: 1,
//   fade: true,
// });


// $('.slider_event_mu').slick({
//   slidesToShow: 1,
//   waitForAnimate: false,
//   dots: false,
//   arrows: false,
//   infinite: true,
//   slidesToScroll: 1,
//   fade: true,
//   swipe: false,
//   asNavFor: '.slider_control_mu'
// });


// $('.slider_control_mu').slick({
//   slidesToShow: 3,
//   waitForAnimate: false,
//   dots: false,
//   // autoplay: true,
//   autoplaySpeed: 1000,
//   arrows: true,
//   slidesToScroll: 1,
//   focusOnSelect: true,
//   asNavFor: '.slider_event_mu'
// });


// $('.slider_control_ha').slick({
//   slidesToShow: 3,
//   waitForAnimate: false,
//   dots: false,
//   // autoplay: true,
//   autoplaySpeed: 1000,
//   arrows: true,
//   slidesToScroll: 1,
//   focusOnSelect: true,
//   asNavFor: '.slider_event_ha'
// });


// $('.slider_event_ha').slick({
//   slidesToShow: 1,
//   waitForAnimate: false,
//   dots: false,
//   arrows: false,
//   infinite: true,
//   slidesToScroll: 1,
//   fade: true,
//   swipe: false,
//   asNavFor: '.slider_control_ha'
// });


$('.slider_event_ha-photo-1').slick({
  slidesToShow: 1,
  waitForAnimate: false,
  dots: false,
  arrows: true,
  infinite: true,
  slidesToScroll: 1,
  fade: true,
});


// $('.slider_event_ha-photo-2').slick({
//   slidesToShow: 1,
//   waitForAnimate: false,
//   dots: false,
//   arrows: true,
//   infinite: true,
//   slidesToScroll: 1,
//   fade: true,
// });


// $('.slider_event_ha-photo-3').slick({
//   slidesToShow: 1,
//   waitForAnimate: false,
//   dots: false,
//   arrows: true,
//   infinite: true,
//   slidesToScroll: 1,
//   fade: true,
// });

$('.mobile_slider_03').slick({
  slidesToShow: 2,
  waitForAnimate: false,
  dots: false,
  arrows: false,
  infinite: true,
  slidesToScroll: 1,
  // fade: true,
  // autoplay: true,
  autoplaySpeed: 2000,
  responsive: [
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
});


$('.slider_mobile_07').slick({
  slidesToShow: 1,
  waitForAnimate: false,
  dots: true,
  arrows: false,
  infinite: true,
  slidesToScroll: 1,
  fade: true,
  adaptiveHeight: true
});


$(".slider_testimonial").slick({
  slidesToShow: 1,
  dots: true,
  arrows: true,
  infinite: true,
  slidesToScroll: 1,
  fade: true,
  customPaging : function(slider, i) {
    var thumb = $(slider.$slides[i]).data();
    return '<a>' + (i+1) + '</a>';
  },
});

//Tabs

// setTimeout(function(){
//   $('.tabs').tabslet({
//     animation: true
//   })
// })


// Accordion

$('.accordion_btn').click(function(event) {
  $('.accordion_items').slideToggle();
  $(this).toggleClass('opened');
  if($(this).hasClass('opened')){
    $('.accordion_btn span').html('Скрыть')
  } else {
    $('.accordion_btn span').html('Посмотреть все')
  }
});





// jQuery(document).ready(function($) {

//   $('.slide_one').click();
//   $('[class*="slider_event_ha"]').slick('slickGoTo', 0)
//   $('[class*="slider_event_mu"]').slick('slickGoTo', 0)

//   function getSliderSettings(){
//     return {
//       slidesToShow: 1,
//       dots: false,
//       arrows: true,
//       infinite: true,
//       slidesToScroll: 1,
//       fade: true,
//       waitForAnimate: false
//     }
//   }

//   function getSliderSettings_ha(){
//     return {
//       slidesToShow: 1,
//       dots: false,
//       arrows: false,
//       infinite: true,
//       slidesToScroll: 1,
//       fade: true,
//       swipe: false,
//       asNavFor: '.slider_control_ha',
//       waitForAnimate: false
//     }
//   }

//   function getSliderSettings_mu(){
//     return {
//       slidesToShow: 1,
//       dots: false,
//       arrows: false,
//       infinite: true,
//       slidesToScroll: 1,
//       fade: true,
//       swipe: false,
//       asNavFor: '.slider_control_mu',
//       waitForAnimate: false
//     }
//   }

//   $('.tabs_control li a').click(function(event) {
//     $('[class*="slider_event_mu-photo"]').slick('unslick');
//     $('[class*="slider_event_mu-photo"]').slick(getSliderSettings());
//     $('.slider_event_mu').slick('unslick');
//     $('.slider_event_mu').slick(getSliderSettings_mu());

//     $('[class*="slider_event_ha-photo"]').slick('unslick');
//     $('[class*="slider_event_ha-photo"]').slick(getSliderSettings());
//     $('.slider_event_ha').slick('unslick');
//     $('.slider_event_ha').slick(getSliderSettings_ha());


//     setTimeout(function() {
//       $('[class*="slider_event_ha"]').slick('slickGoTo', 1);
//       $('[class*="slider_event_mu"]').slick('slickGoTo', 1);
//     }, 100)

//     setTimeout(function() {
//       $('[class*="slider_event_ha"]').slick('slickGoTo', 0);
//       $('[class*="slider_event_mu"]').slick('slickGoTo', 0);
//     }, 100)

//     console.log(1111)
//   });
// });


//First screen glitch

jQuery(document).ready(function($) {
  var viewportWidth = $(window).width();
  if(viewportWidth > 1200){
    setInterval(function(){
        $('#sec_01 .glitch_wrap').toggleClass("animated");
    }, 4000);
  };
});


// Menu

$(document).ready(function() {
    (function() {
      var i, resize;

      i = setInterval(function() {
        return $("#nav .wrapper").toggleClass("cross");
    }, 1500);

      $("#nav .wrapper").click(function() {
        clearInterval(i);
        if($('#nav').hasClass('open')){
            return $("#nav .wrapper").addClass("cross");
        } else {
            return $("#nav .wrapper").removeClass("cross");
        }
    });
      $('.callback').click(function(){
        clearInterval(i);
        $("#nav .wrapper").addClass("cross");
      });
  }).call(this);

    $('#menu').click(function(){
        $('#nav').toggleClass('open');
        $('body').toggleClass('unscroll');
        setTimeout(function() {
          $('#nav .inner').toggleClass('open');
        }, 600);
    });

    $('#nav li a').click(function(){
      $('#nav').removeClass('open');
      $('#nav .inner').removeClass('open');
      $('body').removeClass('unscroll');
      $("#nav .wrapper").removeClass("cross");
    })

    $('html').keydown(function(){
      if (event.keyCode == 27) {
        $('#nav').removeClass('open');
        $('#nav .inner').removeClass('open');
        $('body').removeClass('unscroll');
        $("#nav .wrapper").removeClass("cross");
      }
    });

});