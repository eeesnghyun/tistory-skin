import Slide from './slide.js';

$(function() {
  display_control();
  slider_control();
  detail_side();
  thumnailLoaded();
  var searchForm = $('#search-form');
  var searchInput = $('#search-form input');
  var searchList = $('#search-list');
  var allDelete = $('.allDelete'); 
  var txt = $('.search-inner .txt');
  var TODOS_KEY = "search";
  var searCH = new Array();
  
  function saveStorage(name, val) { //item을 localStorage에 저장합니다.
    typeof(Storage) !== 'undefined' && localStorage.setItem(name, JSON.stringify(val));
  };

  function getStorage(name){
    return JSON.parse(localStorage.getItem(name));
  };

  function allDeleteStorage() { //전체 item을 삭제 
    localStorage.removeItem(TODOS_KEY); 
    txt.html('최근검색어 내역이 없습니다.');
    txt.show();
    searchList.remove();
  };

  function deleteStorage(e) { //각각의 item을 삭제 
    const li = e.target.parentElement.parentElement;
    li.remove();
    searCH = searCH.filter((search) => search.id !== parseInt(li.id));
    searCH.length === 0 && (searchList.remove(), txt.html('최근검색어 내역이 없습니다.'), txt.show());
    saveStorage(TODOS_KEY, searCH);
  };

  function paintStorage(newItem) { //화면에 뿌림 
    var {id, text} = newItem;
    var item = document.createElement("li");
    var div = document.createElement("div"); 
    var i = document.createElement("i"); 
    var a = document.createElement("a");
    item.id = id; 
    item.classList.add('item_sidebar');
    a.innerText = text;
    a.setAttribute('href', '/search/'+text)
    i.classList.add('ic-close-10');
    $(i).on("click", deleteStorage); 
    $(allDelete).on("click", allDeleteStorage);
    div.append(a, i)
    item.append(div); 
    searchList.append(item);
    newItem !== null && allDelete.removeClass('off');
  };

  function handleToDoSubmit(e) { //form 전송 
    e.preventDefault();
    window.location.href='/search/'+looseURIEncode(document.getElementsByName('search')[0].value);
    var newSearchItem = searchInput.val();
    searchInput.value = '';
    var newSearchObj = { id: Date.now(), text: newSearchItem }; 
    searCH.push(newSearchObj);
    
    //text 중복제거
    var newSearch = searCH.filter( 
      (arr, index, callback) => index === callback.findIndex(t => t.text === arr.text)
    );
    saveStorage(TODOS_KEY, newSearch);
  };
  
  $(searchForm).on('submit', handleToDoSubmit);
  var savedStorage = getStorage(TODOS_KEY);
  if(savedStorage !== null) { 
    var items = savedStorage.sort((a,b) => parseInt(b.id) - parseInt(a.id));
    searCH = items //전에 있던 items들을 계속 가지도 있다록 합니다. 
    items.forEach(paintStorage);
  }

  $('.share_js').on('click', function(){
    $('.share_temp').addClass('on');
    setTimeout(function(){
      $('.share_temp').removeClass('on');
    },2000);
    var input = $('.detail_side input');
    
    input.val(window.location.href);
    input.select();

     /* 텍스트 필드 안의 텍스트 복사 */
    navigator.clipboard.writeText(input.val());
  });

  $('.comment').on('click', function(){
    $('html, body').animate({
      scrollTop: $(document).height()
    }, 500);
    $('#comment').focus();
    return false;
  });
  var arr_card = Array.from($('.type_card'));
  arr_card.reduce(function(acc,cur,idx){
    $(cur).addClass('id-'+idx);
  },0);
  var arr_notice = Array.from($('.type_notice'));
  arr_notice.reduce(function(acc,cur,idx){
    $(cur).addClass('id-'+idx);
  },0);

  var windowWidth = $( window ).width();
  var tabBtnWidth = $('.tab_btn:first-child').width();
  $('.line_inner i:first-child').css({'width':tabBtnWidth, 'opacity': 1});
  if(document.getElementById("tt-body-index")){
    var rect = document.querySelector('.tbas_inner').getBoundingClientRect();
    $('.tab_btn').on('click', function(){
      var selfWidth = $(this).width();
      $('.tab_item').siblings().removeClass('active');
      var dataTab = $(this).data('tabs');
      $(this).addClass('on').siblings().removeClass('on');
      $('.visitant').hasClass("on") && ($('.line_inner i:first-child').css({'width':selfWidth, 'opacity': 1}).attr('class', dataTab), $('.tab_item').eq(0).addClass('active'));
      $('.story').hasClass("on") && ($('.line_inner i:first-child').css({'width':selfWidth, 'opacity': 1}).attr('class', dataTab), $('.tab_item').eq(1).addClass('active'));
  
      //모바일 해상도일때 경우
      windowWidth <= 1025 && $('#root').animate({scrollTop: rect.top}, 500);
    });
  } 
  
  $('.header_icon_inner').on('click', function(e) {
    $(e.target).hasClass('ic-search') && ( $('.area_popup').fadeIn(), $('body').css('overflow', 'hidden'), $('input.inp_search').focus() );
  });

  // inp_search 인풋박스
  $('input.inp_search').keyup(function() {
    var content = $(this).val();
    content.length <= 0 ? $(this).removeClass('active') : $(this).addClass('active')
  });
  // 검색어(인풋박스) 삭제
  $('.btn_search_del').click(function() {
    $('input.inp_search').removeClass('active').val('').focus();
  });

  $('.btn_close').on('click', function () {
    $('.area_popup').fadeOut();
    $('body').css('overflow', '');
  });

  /* notice 페이지 리로드시점 */    
  var cookiedata = document.cookie;
  if(cookiedata.indexOf('bell=Y') < 0){
    $('.notice_js').addClass('on');
  } else {
    $('.notice_js').removeClass('on');
  }
   /* // notice 페이지 리로드시점 */

  $('.tab_itme').on('click', function(e) {
    $(e.currentTarget).siblings('.tab_itme').removeClass('on');
    $('.box_gnb').siblings().removeClass('on');
    $(e.currentTarget).addClass('on');

    $('.light').hasClass("on") && ($('.tabs_itmes li:first-child').attr('class', 'LIGHT'), $('.box_gnb').eq(0).addClass('on'));
    $('.dark').hasClass("on") && ($('.tabs_itmes li:first-child').attr('class', 'DARK'), $('.box_gnb').eq(1).addClass('on'));
    return false;
  });

  /** darkMode 여부 체크 */
  var darkModeN = function() {
    var darkmode = false;
    if(typeof(Storage) !== 'undefined'){localStorage.setItem('darkMode', JSON.stringify(darkmode));}
    $('html').attr('data-dark', JSON.parse(localStorage.getItem('darkMode')));
  };
  var darkModeY = function() {
    var darkmode = true;
    if(typeof(Storage) !== 'undefined'){localStorage.setItem('darkMode', JSON.stringify(darkmode));}
    $('html').attr('data-dark', JSON.parse(localStorage.getItem('darkMode')));
  };

  $('.tab_itme').on('click', function() {
    /** // 클릭이벤트 시점에서의 darkMode 여부 체크(최초 렌더링 시점과의 반대) */
    $('.light').hasClass('on') ? darkModeN() : darkModeY()
  });

  /** darkMode 여부 체크 (최초 렌더링 시점)*/
  JSON.parse(localStorage.getItem('darkMode')) ? (darkModeY(), $('.dark').addClass('on'), $('.tabs_itmes li:first-child').attr('class', 'DARK')) : (darkModeN(), $('.light').removeClass('on'), $('.tabs_itmes li:first-child').attr('class', 'LIGHT'))
  /** // darkMode 여부 체크  */

  function sidebarMenuSet(idx){
    if(typeof(Storage) !== 'undefined'){sessionStorage.setItem('menuIdx', JSON.stringify(idx))}
  };
  
  var _self = $('.list_category .category_list > li').eq(JSON.parse(sessionStorage.getItem('menuIdx')));
  function sidebarMenuGet(){
    _self.addClass('active').siblings('li').removeClass('active');
  };
  
  $('.category_list > li > a').on('click', function(){
    var idx = $('.category_list > li > a').index(this);
    sidebarMenuSet(idx);
  });

  /** category_list 해당 카테로기 활성화 (최초 렌더링 시점) */
  JSON.parse(sessionStorage.getItem('menu')) && sidebarMenuGet();

  var $location = $(location),
      pathname = $location.attr('pathname'),
      parts = pathname.split('/');

  if(parts[1] === 'category'){
    _self.addClass('active');
  } else {
    _self.removeClass('active');
  };
  /** // category_list 해당 카테로기 활성화 (최초 렌더링 시점) */
  /** 상세페이지에서 category_list 해당 카테로기 활성화 (상세페이지에서 렌더링 시점)*/ 
  var categoryDetailTit = $('.info_text > span').text();
  var fruits = new Array();
  $('.list_category .category_list > li').each(function(idx, el){
    var categoryTit = $(el).find('a').text().trim();
    fruits.push(categoryTit)
  });
  if(typeof(Storage) !== 'undefined'){sessionStorage.setItem('categoryList', JSON.stringify(fruits))}

  $.each(JSON.parse(sessionStorage.getItem('categoryList')), function(idx, el){
    if(el === categoryDetailTit){
      $('.list_category .category_list > li').eq(idx).addClass('active');
    }
  });
  /** // 상세페이지에서 category_list 해당 카테로기 활성화 (상세페이지에서 렌더링 시점)*/ 
  /** 상세페이지에서 img alt 속성추가 및 저작관 표시작에 rel 적용 (상세페이지에서 렌더링 시점)*/ 
  var imgText = $('figure figcaption').html();
  $('#tt-body-page').length && ($('figure img').attr('alt', imgText), $('.link_ccl').attr('rel', 'noopener'));
  /** // 상세페이지에서 img alt 속성추가 및 저작관 표시작에 rel 적용 (상세페이지에서 렌더링 시점)*/ 
  
  
  function setScreenSize() {
    var vw = 0;
    var vh = window.innerHeight * 0.01;
    windowWidth <= 1025 ? vw = (window.innerWidth - 40) * 0.01 : vw = ($('.area_sidebar').width() - 40) * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  }
  setScreenSize();
  window.addEventListener('resize', setScreenSize);

  Array.from((document.querySelectorAll('#container .inner_header span.date'))).forEach(function(el) {
    el.innerText = el.innerText.substr(0, 11);
  })

  $('.mo_footer_menu').on('click', 'a', function() {
    $('.area_sidebar').addClass('on');
    $('body').css('overflow', 'hidden');
  });

  $('.close_icon').on('click', function() {
    $('.area_sidebar').removeClass('on');
    $('body').css('overflow', '');
  });
  
  /* 서식 관리 tabs */
  var tabs_warp = Array.from(document.querySelectorAll('.tabs_warp'));
  tabs_warp.forEach(function(el, idx){
    el.dataset.tabs = idx+1
    if(idx+1 === parseInt(el.dataset.tabs)){
      $('.tabs_inner').eq(idx).addClass(`tabs_${idx+1}`);
    }

    $(`.tabs_${idx+1}`).on('click', function(e){
      e.preventDefault();
      var attr = $(e.target).attr('href');
      var txt = $(e.target).html();
      $(attr).show().siblings().hide();
      e.target !== this ? ($(e.target).addClass('on').siblings().removeClass('on'), $(`.tabs_inner.tabs_${idx+1} > span`).attr('class', txt)) : null
    });
  });
  /* // 서식 관리 tabs */
  /* code Copy */
  $('.article_view pre').prepend('<button class="code_btn" data-txt="Copy" aria-label="Code Copy"><i class="ic-copy"></i></button>');
  $('.code_btn').on('click', function(){
    var self = $(this);
    var hljsTxt = self.next('.hljs').text();
    navigator.clipboard.writeText(hljsTxt);/* 텍스트 클립보드 복사 */
    self.attr('data-txt', 'Copied !').addClass('on');

    setTimeout(function(){
      self.attr('data-txt', 'Copy').removeClass('on');
    },2000);
  });
  /* // code Copy */
  
  /* 공지 사항 */
  $('.notice_js').on('click', function() {
    setCookie('bell', 'Y', 5);
    $(this).removeClass('on');
    $('.notice_template').addClass('on');
    var frag = document.getElementsByTagName('template')[0];
    var copy = frag.content.cloneNode(true);
    $('.notice_template .contents').html(copy);
  });

  $('.closeIcon').on('click', function() {
    $('.notice_template').removeClass('on');
  });

  $(window).on('scroll', function() {
    !$('.notice_template').hasClass('on') ? null : $('.notice_template').removeClass('on')
  });
  /* // 공지 사항 */

  // 메인 페이지 Slide 기능 Card영역 같은 경우 inithandCard 메소드 실행!
  new Slide({
    targets: {
      startEl: '.type_card',
      endEl: '.item_card',
    },
    navigation: {
      nextEl: ".typeCard_next",
      prevEl: ".typeCard_prev",
    },
    additems: 5, //움직일 아이템 개수를 정의합니다.
  }).inithandCard();

  // 메인 페이지 Slide 기능 Notice영역 같은 경우 inithandNotice 메소드 실행!
  new Slide({
    targets: {
      startEl: '.type_notice',
      endEl: '.item_notice',
    },
    navigation: {
      nextEl: ".typeNotice_next",
      prevEl: ".typeNotice_prev",
    },
    additems: 1, //움직일 아이템 개수를 정의합니다.
  }).inithandNotice();
});

function setCookie(name, value, day) {
var date = new Date(); 
date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000); 
document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/'; 
};

function getCookie(name) { 
var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)'); 
return value? value[2] : null; 
};

function slider_control() {
  var interleaveOffset = 0.5;
  var slide_data = $('.slide_zone').data('slide');
  var windowWidth = $( window ).width();
  
  /* 매인 배너 영역 Swiper기능 */
  (function(){
    var swiperOptions = {
      loop: false,
      
      watchSlidesProgress: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'progressbar',
        clickable: true,
      },
      speed: 500,
      // autoplay: {
      //   delay: 4600,
      //   disableOnInteraction: false,
      // },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      on: {
          init: function () {
            $(".swiper-progress-bar").removeClass("animate");
            $(".swiper-progress-bar").removeClass("active");
            $(".swiper-progress-bar").eq(0).addClass("animate");
            $(".swiper-progress-bar").eq(0).addClass("active");
          },
          slideChangeTransitionStart: function () {
            $(".swiper-progress-bar").removeClass("animate");
            $(".swiper-progress-bar").removeClass("active");
            $(".swiper-progress-bar").eq(0).addClass("active");
          },
          slideChangeTransitionEnd: function () {
            $(".swiper-progress-bar").eq(0).addClass("animate");
          },
          progress: function() {
            var swiper = this;
            swiper.slides.reduce(function(acc,cur,idx){
              var slideProgress = swiper.slides[idx].progress;
              var innerOffset = swiper.width * interleaveOffset;
              var innerTranslate = slideProgress * innerOffset;
              $('.swiper-progress-bar').css({"background": `rgba(${slide_data.color[idx].text},0.3)`});
              $('.swiper-progress-bar .slide_progress-bar::after').css({"background": `rgb(${slide_data.color[idx].text})`});
              
              $(swiper.slides[idx]).find('.link_slide').css({
                "transform":"translate3d(" + innerTranslate + "px, 0, 0)",
                "background-color": slide_data.color[idx].bg
              });
              if(windowWidth <= 1025) { //모바일 해상도일때 경우
                $(swiper.slides[idx]).find('.link_slide .bg_gradient').css({
                  "background": `rgb(${slide_data.color[idx].gradient})`,
                  "background": `linear-gradient(180deg, rgba(${slide_data.color[idx].gradient},1) 0%, rgba(${slide_data.color[idx].gradient},1) 46%, rgba(${slide_data.color[idx].gradient},0) 100%)`,
                });
              } else { //PC 해상도일때 경우
                $(swiper.slides[idx]).find('.link_slide .bg_gradient').css({
                  "background": `rgb(${slide_data.color[idx].gradient})`,
                  "background": `linear-gradient(90deg, rgba(${slide_data.color[idx].gradient},1) 0%, rgba(${slide_data.color[idx].gradient},1) 50%, rgba(${slide_data.color[idx].gradient},0) 100%)`,
                });
              }
              $(swiper.slides[idx]).find('.link_slide .text_slide').css({
                "color": slide_data.color[idx].text
              });
            },0); 
          },
          setTransition: function(_, speed) {
            var swiper = this;
            for (var i = 0; i < swiper.slides.length; i++) {
              swiper.slides[i].style.transition = speed + "ms";
              swiper.slides[i].querySelector(".link_slide").style.transition = speed + "ms";
            }
          }
        }
    };

    if(windowWidth <= 1025){  //모바일 해상도일때 경우
      swiperOptions.simulateTouch = true
    } else {  //PC 해상도일때 경우
      swiperOptions.simulateTouch = true
    }

    var myswiper = new Swiper('.swiper-container', swiperOptions);
    
    $(".swiper-button-pause").click(function(){
      myswiper.autoplay.stop();
    });
    $(".swiper-button-play").click(function(){
      myswiper.autoplay.start();
    });
    $(".swiper-playpau").click(function(e){
      $(e.currentTarget).removeClass('on').siblings().addClass('on');
    });
  })();
  /* 매인 배너 영역 Swiper기능 // */
};

function display_control() {
// 박스 헤더
if ($('#main .area_cover').children(':first-child').hasClass('type_featured')) {
  $('#wrap').addClass('white');
} else if ($('#main .area_cover').length > 0) {
  $('#main .area_cover').addClass('cover_margin');
}

// 글 출력이 있는 경우
if ($('.area_view').length != false) {
  if($('#main > .area_cover:first-child > .type_featured:first-child, .type_article_header_cover').length) { $('#wrap').addClass('white');}
}

// 로그인, 로그아웃 버튼 처리
if (window.T.config.USER.name) {
  $('.btn-for-user').show();
} else {
  $('.btn-for-guest').show();
}

$('.btn-for-guest [data-action="login"]').click(function() {
  document.location.href = 'https://www.tistory.com/auth/login?redirectUrl=' + encodeURIComponent(window.TistoryBlog.url);
});
$('.btn-for-user [data-action="logout"]').click(function() {
  document.location.href = 'https://www.tistory.com/auth/logout?redirectUrl=' + encodeURIComponent(window.TistoryBlog.url);
});
};

function detail_side(){
$('.btn_post').attr('id','reaction'); //Node 대상 찾기 위해서 이미로 id 넣어줌.
/* 공감 아이콘 클릭 이벤트 처리 */
if ($('.postbtn_like .uoc-icon').hasClass('btn_post')) {
  /* 공감 수 변경 시 처리 */
  var targetNode = document.getElementById('reaction'); // 감시할 대상 Node
  var config = { attributes: true, childList: true, subtree: true }; // 감시자 설정
  function callback(mutationsList) {
    var txt_like = mutationsList[0].target.querySelector('.txt_like').textContent;
    if(mutationsList[0].type === 'attributes') {
      $('.detail_side .util_like .txt_count').text(txt_like);
    } else {
      console.log(txt_like)
    }
    mutationsList[0].target.classList.contains('like_on') ? $('.item1 i').attr('class', 'ic-like-bg') : $('.item1 i').attr('class', 'ic-like'); //새로시점에 변경 유지
  };
  // 공감 클릭 이벤트 연결
  $('.detail_side .util_like').click(function () {
    $('.postbtn_like .uoc-icon').trigger('click');
    !$('.postbtn_like .uoc-icon').hasClass('like_on') ? $('.item1 i').attr('class', 'ic-like-bg') : $('.item1 i').attr('class', 'ic-like'); //클릭 이벤트 시점에 변경
  });
  
  // 감시자 인스턴스 생성
  var observer = new MutationObserver(callback);
  // 감시할 대상 Node를 전달하여 감시 시작
  observer.observe(targetNode, config);
  /* 공감 수 변경 시 처리 // */
  setTimeout(function(){
    $('.detail_side .util_like .txt_count').text($('.postbtn_like .uoc-icon .txt_like').text());
  },450);
}
/* 공감 아이콘 클릭 이벤트 처리 */
};

/** 모든 리스트에 섬네일들 Lazy-Loading 만들기 */
function thumnailLoaded() {
  var target = Array.from(document.querySelectorAll('.thumnail')); // 감시할 대상자
  function callback(entries, observer) {
    entries.forEach(function(entry){
      // 관찰 대상이 viewport 안에 들어온 경우 'tada' 클래스를 추가
      if (entry.intersectionRatio > 0) {
        entry.target.style.backgroundImage = `url(${entry.target.dataset.src})`;
         // 이미지를 불러왔다면 타켓 엘리먼트에 대한 관찰을 멈춘다.
        observer.unobserve(entry.target);
      }
    });
  };
  var io = new IntersectionObserver(callback)
  
  target.forEach(function(el, idx){
    io.observe(el)
  });
};